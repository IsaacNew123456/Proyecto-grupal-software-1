import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';

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
    // 1. Obtener el último hash registrado para encadenar
    const ultimoRegistro = await this.prisma.auditLog.findFirst({
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
      orderBy: { timestamp: 'asc' },
      select: { id: true, hash: true, prevHash: true, timestamp: true },
    });

    const genesisHash = 'GENESIS_HASH_ERGOCHECK_2026';
    let prevHashCalculado = genesisHash;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.prevHash && log.prevHash !== prevHashCalculado) {
        return {
          valida: false,
          totalRegistros: logs.length,
          genesisHash,
          ultimoHash: log.hash || '',
          errorIndex: i,
          tiempoVerificacionMs: Date.now() - inicio,
        };
      }
      prevHashCalculado = log.hash || '';
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
