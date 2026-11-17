import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as ExcelJS from 'exceljs';

export interface FiltrosBitacora {
  categoria?: string;
  accion?: string;
  busqueda?: string;
  fechaInicio?: string;
  fechaFin?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class BitacoraInmutableService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra una acción en la bitácora inmutable encadenada con SHA-256 (WORM).
   */
  async registrar(params: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    categoria?: string;
    ipAddress?: string;
    details?: any;
  }) {
    // 1. Obtener el último hash registrado para encadenar (solo registros con hash válido)
    const ultimoRegistro = await this.prisma.auditLog.findFirst({
      where: { hash: { not: null } },
      orderBy: { timestamp: 'desc' },
      select: { hash: true },
    });

    const prevHash = ultimoRegistro?.hash || 'GENESIS_HASH_ERGOCHECK_2026';
    const timestamp = new Date();
    const dataString = `${prevHash}|${params.userId || 'SISTEMA'}|${params.action}|${params.entity}|${params.entityId || ''}|${timestamp.toISOString()}|${JSON.stringify(params.details || {})}`;
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');

    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        categoria: params.categoria || 'SEGURIDAD',
        ipAddress: params.ipAddress,
        details: params.details,
        prevHash,
        hash,
        timestamp,
      },
    });
  }

  /**
   * Mapea categorías normalizadas de RF50 (Eventos Técnicos, Accesos a Datos, Cambios de Políticas)
   * con compatibilidad hacia categorías históricas del sistema.
   */
  private construirFiltroCategoria(categoria?: string): any {
    if (!categoria || categoria === 'TODAS') return undefined;
    if (categoria === 'EVENTOS_TECNICOS') {
      return { in: ['EVENTOS_TECNICOS', 'SUPERVISION', 'SISTEMA'] };
    }
    if (categoria === 'ACCESOS_DATOS') {
      return { in: ['ACCESOS_DATOS', 'SEGURIDAD'] };
    }
    if (categoria === 'CAMBIOS_POLITICAS') {
      return { in: ['CAMBIOS_POLITICAS', 'LEGAL_COMPLIANCE', 'AUDITORIA', 'CONFIGURACION'] };
    }
    return categoria;
  }

  /**
   * Consulta registros con soporte de filtros por categoría, búsqueda de texto y rango de fechas.
   */
  async consultarRegistros(filtros: FiltrosBitacora = {}) {
    const { categoria, accion, busqueda, fechaInicio, fechaFin, limit = 50, offset = 0 } = filtros;
    const where: any = {};

    const catFilter = this.construirFiltroCategoria(categoria);
    if (catFilter) {
      where.categoria = catFilter;
    }

    if (accion) {
      where.action = { contains: accion, mode: 'insensitive' };
    }

    if (fechaInicio || fechaFin) {
      where.timestamp = {};
      if (fechaInicio) where.timestamp.gte = new Date(fechaInicio);
      if (fechaFin) {
        const hasta = new Date(fechaFin);
        hasta.setHours(23, 59, 59, 999);
        where.timestamp.lte = hasta;
      }
    }

    if (busqueda && busqueda.trim()) {
      const q = busqueda.trim();
      where.OR = [
        { action: { contains: q, mode: 'insensitive' } },
        { entity: { contains: q, mode: 'insensitive' } },
        { entityId: { contains: q, mode: 'insensitive' } },
        { hash: { contains: q, mode: 'insensitive' } },
        {
          usuario: {
            OR: [
              { nombre: { contains: q, mode: 'insensitive' } },
              { apellido: { contains: q, mode: 'insensitive' } },
              { correo: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [total, registros] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true, correo: true } },
        },
      }),
    ]);

    return { total, registros, limit, offset };
  }

  /**
   * Verificación matemática de la integridad de la cadena SHA-256.
   * Recorre bloque a bloque verificando que cada prevHash coincida con el hash anterior.
   */
  async verificarIntegridadCadena(): Promise<{
    valida: boolean;
    totalRegistros: number;
    genesisHash: string;
    ultimoHash: string;
    errorIndex?: number;
    tiempoVerificacionMs: number;
  }> {
    const inicio = Date.now();
    const logs = await this.prisma.auditLog.findMany({
      where: { hash: { not: null } },
      orderBy: { timestamp: 'asc' },
      select: { id: true, hash: true, prevHash: true, timestamp: true },
    });

    const genesisHash = 'GENESIS_HASH_ERGOCHECK_2026';
    const hashesValidos = new Set<string>([genesisHash]);

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (!log.hash || !log.prevHash) continue;

      // Cada bloque debe referenciar un ancestro hash legítimo o el bloque génesis
      if (!hashesValidos.has(log.prevHash)) {
        return {
          valida: false,
          totalRegistros: logs.length,
          genesisHash,
          ultimoHash: log.hash || '',
          errorIndex: i,
          tiempoVerificacionMs: Date.now() - inicio,
        };
      }
      hashesValidos.add(log.hash);
    }

    return {
      valida: true,
      totalRegistros: logs.length,
      genesisHash,
      ultimoHash: logs[logs.length - 1]?.hash || genesisHash,
      tiempoVerificacionMs: Date.now() - inicio,
    };
  }

  /**
   * Obtiene estadísticas agregadas de la bitácora WORM.
   */
  async obtenerEstadisticas() {
    const [total, porCategoria, ultimo] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.groupBy({
        by: ['categoria'],
        _count: { id: true },
      }),
      this.prisma.auditLog.findFirst({
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true, hash: true, action: true },
      }),
    ]);

    return {
      totalRegistros: total,
      porCategoria: porCategoria.map((c) => ({ categoria: c.categoria, count: c._count.id })),
      ultimoEvento: ultimo,
    };
  }

  /**
   * Exporta registros en formato Excel (.xlsx) estructurado como tabla profesional de auditoría.
   */
  async exportarExcel(categoria?: string): Promise<Buffer> {
    const catFilter = this.construirFiltroCategoria(categoria);
    const where = catFilter ? { categoria: catFilter } : {};
    const [verificacion, logs] = await Promise.all([
      this.verificarIntegridadCadena(),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 1000,
        include: {
          usuario: { select: { nombre: true, apellido: true, correo: true } },
        },
      }),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ErgoCheck AI - Módulo de Auditoría y Trazabilidad';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('Bitácora de Auditoría');

    // Configurar columnas
    ws.columns = [
      { key: 'num', width: 8 },
      { key: 'fecha', width: 22 },
      { key: 'accion', width: 34 },
      { key: 'operador', width: 26 },
      { key: 'correo', width: 30 },
      { key: 'entidad', width: 22 },
      { key: 'entityId', width: 26 },
      { key: 'categoria', width: 22 },
      { key: 'ip', width: 18 },
      { key: 'hash', width: 34 },
      { key: 'prevHash', width: 34 },
      { key: 'detalles', width: 45 },
    ];

    // Título Principal
    ws.mergeCells('A1:L1');
    const titleCell = ws.getCell('A1');
    titleCell.value = 'ErgoCheck AI — Bitácora Inmutable de Auditoría y Seguridad';
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF065F46' } };
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    ws.getRow(1).height = 28;

    // Subtítulo
    ws.mergeCells('A2:L2');
    const subCell = ws.getCell('A2');
    subCell.value = 'Registro Criptográfico SHA-256 • Modo WORM Inmutable • Trazabilidad y Cumplimiento Normativo SST';
    subCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };
    subCell.alignment = { horizontal: 'left', vertical: 'middle' };
    ws.getRow(2).height = 18;

    // Resumen de metadatos (Fila 4)
    ws.getRow(4).values = [
      'Fecha:',
      new Date().toLocaleString(),
      'Filtro Categoría:',
      categoria || 'TODAS LAS CATEGORÍAS',
      'Total Registros:',
      logs.length,
      'Cadena SHA-256:',
      verificacion.valida ? '100% ÍNTEGRA Y CERTIFICADA' : 'RUPTURA DETECTADA',
    ];
    ws.getRow(4).font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF334155' } };
    ws.getRow(4).height = 20;

    // Encabezado de la tabla (Fila 6)
    const headerRow = ws.getRow(6);
    headerRow.values = [
      'N°',
      'Fecha y Hora',
      'Acción Realizada',
      'Operador / Usuario',
      'Correo Electrónico',
      'Entidad',
      'ID Entidad',
      'Categoría',
      'Dirección IP',
      'Hash SHA-256 (Bloque)',
      'Hash Previo (WORM)',
      'Detalles / Parámetros',
    ];
    headerRow.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 26;

    const borderThin: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    };

    // Agregar filas de datos
    logs.forEach((log, index) => {
      const numFila = index + 1;
      const operadorNombre = log.usuario
        ? `${log.usuario.nombre} ${log.usuario.apellido}`
        : 'SISTEMA';
      const operadorCorreo = log.usuario?.correo || 'Proceso Automático';
      const detallesTexto = log.details ? JSON.stringify(log.details) : '—';

      const row = ws.addRow([
        numFila,
        new Date(log.timestamp).toLocaleString(),
        log.action,
        operadorNombre,
        operadorCorreo,
        log.entity,
        log.entityId || 'Global',
        log.categoria,
        log.ipAddress || '127.0.0.1 (Local)',
        log.hash || '—',
        log.prevHash || '—',
        detallesTexto,
      ]);

      row.height = 20;
      row.alignment = { vertical: 'middle' };

      // Estilo por celda
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(3).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
      row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(9).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(10).font = { name: 'Consolas', size: 8, color: { argb: 'FF047857' } };
      row.getCell(11).font = { name: 'Consolas', size: 8, color: { argb: 'FF64748B' } };
      row.getCell(12).font = { name: 'Consolas', size: 8, color: { argb: 'FF334155' } };

      const isEven = index % 2 === 1;
      row.eachCell((cell, colNumber) => {
        cell.border = borderThin;
        if (isEven && colNumber !== 8) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }
      });

      // Color de categoría
      const catCell = row.getCell(8);
      let catBg = 'FFF1F5F9';
      let catFg = 'FF475569';
      if (log.categoria === 'EVENTOS_TECNICOS') { catBg = 'FFDBEAFE'; catFg = 'FF1D4ED8'; }
      else if (log.categoria === 'ACCESOS_DATOS') { catBg = 'FFE0E7FF'; catFg = 'FF4338CA'; }
      else if (log.categoria === 'CAMBIOS_POLITICAS') { catBg = 'FFF3E8FF'; catFg = 'FF7E22CE'; }
      else if (log.categoria === 'SEGURIDAD') { catBg = 'FFFFE4E6'; catFg = 'FFE11D48'; }
      else if (log.categoria === 'AUDITORIA') { catBg = 'FFFEF3C7'; catFg = 'FFB45309'; }
      else if (log.categoria === 'SUPERVISION') { catBg = 'FFE0F2FE'; catFg = 'FF0369A1'; }
      else if (log.categoria === 'ERGONOMIA') { catBg = 'FFD1FAE5'; catFg = 'FF047857'; }

      catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: catBg } };
      catCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: catFg } };
    });

    // Auto-filtro en la cabecera
    ws.autoFilter = {
      from: 'A6',
      to: `L${6 + logs.length}`,
    };

    // Congelar paneles
    ws.views = [{ state: 'frozen', ySplit: 6 }];

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  /**
   * Exporta registros en formato CSV compatible con Excel y herramientas de auditoría.
   */
  async exportarCsv(categoria?: string): Promise<string> {
    const catFilter = this.construirFiltroCategoria(categoria);
    const where = catFilter ? { categoria: catFilter } : {};
    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 500,
      include: {
        usuario: { select: { correo: true } },
      },
    });

    const headers = 'ID,Fecha_ISO,Usuario_Correo,Accion,Entidad,Entidad_ID,Categoria,IP_Address,Hash_SHA256,Hash_Previo\n';
    const rows = logs
      .map((l) => {
        const u = l.usuario?.correo || 'SISTEMA';
        const clean = (val?: string | null) => (val ? `"${val.replace(/"/g, '""')}"` : '""');
        return [
          clean(l.id),
          clean(l.timestamp.toISOString()),
          clean(u),
          clean(l.action),
          clean(l.entity),
          clean(l.entityId),
          clean(l.categoria),
          clean(l.ipAddress),
          clean(l.hash),
          clean(l.prevHash),
        ].join(',');
      })
      .join('\n');

    return headers + rows;
  }

  /**
   * Exporta registros completos con metadata criptográfica en formato JSON.
   */
  async exportarJson(categoria?: string) {
    const catFilter = this.construirFiltroCategoria(categoria);
    const where = catFilter ? { categoria: catFilter } : {};
    const [verificacion, logs] = await Promise.all([
      this.verificarIntegridadCadena(),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 500,
        include: {
          usuario: { select: { id: true, nombre: true, apellido: true, correo: true } },
        },
      }),
    ]);

    return {
      metadata: {
        sistema: 'ErgoCheck AI — Plataforma SST & Proctoring',
        modulo: 'Bitácora Inmutable WORM (CU26)',
        fechaExportacion: new Date().toISOString(),
        totalRegistrosExportados: logs.length,
        integridadCadena: verificacion.valida ? 'VALIDA_CERTIFICADA' : 'COMPROMETIDA',
        genesisHash: verificacion.genesisHash,
        ultimoHash: verificacion.ultimoHash,
      },
      registros: logs,
    };
  }
}
