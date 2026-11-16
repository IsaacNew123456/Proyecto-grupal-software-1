import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConsentGuard } from '../../common/guards/consent.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { MotorCorrelacionService } from './services/motor-correlacion.service';
import { BitacoraInmutableService } from './services/bitacora-inmutable.service';
import { GeneradorReportesService } from './services/generador-reportes.service';
import { SupervisionGateway } from './gateways/supervision.gateway';

export class AuditarIncidenteDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['CONFIRMADO', 'DESESTIMADO', 'FALSO_POSITIVO', 'VALIDADO'])
  estado: string;

  @IsString()
  @IsOptional()
  justificacion?: string;
}

@ApiTags('Supervisión y Auditoría Sprint 4')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('supervision')
export class SupervisionSp4Controller {
  constructor(
    private readonly prisma: PrismaService,
    private readonly correlacion: MotorCorrelacionService,
    private readonly bitacora: BitacoraInmutableService,
    private readonly reportes: GeneradorReportesService,
    private readonly gateway: SupervisionGateway,
  ) {}

  @Get('puestos-en-vivo')
  @ApiOperation({ summary: 'CU21 – Consultar puestos de monitoreo en tiempo real' })
  async listarPuestosEnVivo() {
    return this.gateway.obtenerPuestos();
  }

  @Post('puestos-en-vivo/simular')
  @ApiOperation({ summary: 'CU21 – Simular 5 puestos en tiempo real para verificar el semáforo y watchdog' })
  async simularPuestosEnVivo() {
    return this.gateway.simularPuestosDemo();
  }

  @Get('sesiones')
  @ApiOperation({ summary: 'CU20/CU21 – Listar sesiones de supervisión de la organización' })
  async listarSesiones(@CurrentUser() user: AuthenticatedUser) {
    return this.prisma.supervisionSession.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: { inicio: 'desc' },
      take: 20,
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, correo: true } },
        _count: { select: { eventosConducta: true, incidentes: true } },
      },
    });
  }

  @Post('sesiones/demo')
  @ApiOperation({ summary: 'CU20 – Crear sesión demo con eventos para demostración' })
  async crearSesionDemo(@CurrentUser() user: AuthenticatedUser) {
    const ahora = new Date();
    const sesion = await this.prisma.supervisionSession.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        tipo: 'EXAMEN',
        estado: 'COMPLETADA',
        inicio: new Date(ahora.getTime() - 25 * 60000),
        fin: ahora,
        scoreIntegridad: 85.0,
      },
    });

    const eventosDemo = [
      { tipo: 'GAZE_DOWN_SUSTAINED', severidad: 'MEDIUM', duracionMs: 4200, detalles: { pitch: -34, yaw: 2, rulaScore: 4 }, offsetMin: 22 },
      { tipo: 'GAZE_DOWN_SUSTAINED', severidad: 'HIGH', duracionMs: 5100, detalles: { pitch: -38, yaw: 1, rulaScore: 4 }, offsetMin: 21 },
      { tipo: 'WINDOW_BLUR', severidad: 'MEDIUM', duracionMs: 6200, detalles: { windowTitle: 'Navegador externo' }, offsetMin: 18 },
      { tipo: 'GAZE_OFFSCREEN', severidad: 'MEDIUM', duracionMs: 3800, detalles: { direccion: 'RIGHT_UP' }, offsetMin: 18 },
      { tipo: 'MULTIPLE_FACES', severidad: 'CRITICAL', duracionMs: 4500, detalles: { totalRostros: 2 }, offsetMin: 14 },
      { tipo: 'SHORTCUT_BLOCKED', severidad: 'MEDIUM', duracionMs: 200, detalles: { tecla: 'Ctrl+C' }, offsetMin: 10 },
      { tipo: 'SHORTCUT_BLOCKED', severidad: 'HIGH', duracionMs: 200, detalles: { tecla: 'Ctrl+V' }, offsetMin: 10 },
      { tipo: 'POSTURA_FORZADA', severidad: 'MEDIUM', duracionMs: 8000, detalles: { rulaScore: 5, cuelloAngulo: 24, troncoAngulo: 18 }, offsetMin: 6 },
      { tipo: 'POSTURA_FORZADA', severidad: 'HIGH', duracionMs: 12000, detalles: { rulaScore: 6, cuelloAngulo: 28, troncoAngulo: 20 }, offsetMin: 5 },
      { tipo: 'FACE_ABSENT', severidad: 'HIGH', duracionMs: 7500, detalles: { motivo: 'Ausencia total de encuadre' }, offsetMin: 2 },
    ];

    for (const ev of eventosDemo) {
      await this.prisma.behaviorEvent.create({
        data: {
          sessionId: sesion.id,
          userId: user.id,
          tipo: ev.tipo,
          severidad: ev.severidad,
          duracionMs: ev.duracionMs,
          detalles: ev.detalles,
          timestamp: new Date(ahora.getTime() - ev.offsetMin * 60000),
        },
      });
    }

    const incidentes = await this.correlacion.evaluarVentanaDeslizante(sesion.id);

    return {
      mensaje: 'Sesión demo creada y correlacionada exitosamente con el motor CU20',
      sessionId: sesion.id,
      totalEventosInyectados: eventosDemo.length,
      totalIncidentesGenerados: incidentes.length,
      incidentes,
    };
  }

  @Post('correlacion/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'CU20 – Ejecutar motor de correlación de ventana deslizante' })
  async correlacionar(@Param('sessionId') sessionId: string) {
    const incidentes = await this.correlacion.evaluarVentanaDeslizante(sessionId);
    return { total: incidentes.length, incidentes };
  }

  @Get('incidentes/:sessionId')
  @ApiOperation({ summary: 'CU22 – Listar incidentes correlacionados de una sesión' })
  async listarIncidentes(@Param('sessionId') sessionId: string) {
    return this.correlacion.obtenerIncidentes(sessionId);
  }

  @Put('incidentes/:incidentId/auditar')
  @ApiOperation({ summary: 'CU22 – Auditar incidente (confirmar/desestimar/falso positivo)' })
  async auditarIncidente(
    @Param('incidentId') incidentId: string,
    @Body() dto: AuditarIncidenteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const estadoNormalizado = dto.estado === 'VALIDADO' ? 'CONFIRMADO' : dto.estado;
    const resultado = await this.correlacion.auditarIncidente(
      incidentId,
      estadoNormalizado,
      dto.justificacion,
      user.id,
    );

    await this.bitacora.registrar({
      userId: user.id,
      action: 'AUDITAR_INCIDENTE',
      entity: 'Incident',
      entityId: incidentId,
      categoria: 'AUDITORIA',
      details: { estadoNuevo: estadoNormalizado, justificacion: dto.justificacion },
    });

    return resultado;
  }

  @Get('indices/:sessionId')
  @ApiOperation({ summary: 'CU23 – Obtener índices sintéticos de Integridad y Bienestar Ergonómico' })
  async obtenerIndices(@Param('sessionId') sessionId: string) {
    return this.correlacion.calcularIndices(sessionId);
  }

  @Post('sesiones/:sessionId/cerrar')
  @ApiOperation({ summary: 'CU23 – Cerrar sesión y calcular/persistir índices sintéticos' })
  async cerrarSesion(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const indices = await this.correlacion.calcularIndices(sessionId);
    const sesion = await this.prisma.supervisionSession.update({
      where: { id: sessionId },
      data: {
        estado: 'COMPLETADA',
        fin: new Date(),
        scoreIntegridad: indices.indiceIntegridad,
      },
    });

    await this.bitacora.registrar({
      userId: user.id,
      action: 'CERRAR_SESION_SUPERVISION',
      entity: 'SupervisionSession',
      entityId: sessionId,
      categoria: 'SUPERVISION',
      details: {
        scoreIntegridad: indices.indiceIntegridad,
        indiceBienestar: indices.indiceBienestar,
        totalIncidentes: indices.totalIncidentes,
      },
    });

    return {
      mensaje: 'Sesión cerrada exitosamente e índices sintéticos calculados',
      sesion,
      indices,
    };
  }

  @Get('reportes/:sessionId/ergonomico-excel')
  @ApiOperation({ summary: 'CU24 – Descargar reporte ergonómico corporativo en formato Excel (.xlsx)' })
  async descargarReporteExcel(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const session = await this.prisma.supervisionSession.findUnique({
      where: { id: sessionId },
      include: { usuario: true, organizacion: true, eventosConducta: true, incidentes: true },
    });
    if (!session) throw new NotFoundException('Sesión de supervisión no encontrada');

    const minutosTotales = Math.max(
      1,
      Math.round(
        ((session.fin ? session.fin.getTime() : Date.now()) - new Date(session.inicio).getTime()) / 60000,
      ),
    );

    const evsErgonomicos = session.eventosConducta.filter(
      (e) => e.tipo === 'POSTURA_FORZADA' || (e.detalles as any)?.rulaScore,
    );

    let promedioRula = 2.8;
    if (evsErgonomicos.length > 0) {
      const sum = evsErgonomicos.reduce((acc, e) => acc + Number((e.detalles as any)?.rulaScore || 3.5), 0);
      promedioRula = sum / evsErgonomicos.length;
    }

    const indices = await this.correlacion.calcularIndices(sessionId);

    const buffer = await this.reportes.generarReporteErgonomicoExcel({
      sessionId: session.id,
      organizacion: session.organizacion?.nombre,
      evaluado: session.usuario ? `${session.usuario.nombre} ${session.usuario.apellido}` : 'Evaluado',
      correo: session.usuario?.correo,
      minutosTotales,
      totalAlertas: evsErgonomicos.length > 0 ? evsErgonomicos.length : session.incidentes?.length || 0,
      promedioRula,
      scoreBienestar: indices.indiceBienestar,
      eventosErgonomicos: evsErgonomicos,
    });

    // Registrar en bitácora inmutable WORM (CU26)
    await this.bitacora.registrar({
      userId: user.id,
      action: 'EXPORTAR_REPORTE_ERGONOMICO_EXCEL',
      entity: 'SupervisionSession',
      entityId: sessionId,
      categoria: 'ERGONOMIA',
      details: {
        minutosTotales,
        promedioRula: promedioRula.toFixed(1),
        scoreBienestar: indices.indiceBienestar,
      },
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="reporte-ergonomico-${sessionId.slice(0, 8)}.xlsx"`);
    res.end(buffer);
  }

  @Get('reportes/:sessionId/forense-pdf')
  @ApiOperation({ summary: 'CU25 – Descargar dictamen forense PDF con sello SHA-256' })
  async descargarReportePdf(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const session = await this.prisma.supervisionSession.findUnique({
      where: { id: sessionId },
      include: {
        usuario: true,
        organizacion: true,
        incidentes: { orderBy: { timestamp: 'asc' } },
        eventosConducta: { orderBy: { timestamp: 'asc' } },
        respuestasControl: { include: { pregunta: true } },
      },
    });
    if (!session) throw new NotFoundException('Sesión de supervisión no encontrada');

    const buffer = await this.reportes.generarReporteForensePdf(session);

    // Registrar auditoría de descarga en bitácora WORM (CU26 / Seguridad)
    await this.bitacora.registrar({
      userId: user.id,
      action: 'EXPORTAR_REPORTE_FORENSE_PDF',
      entity: 'SupervisionSession',
      entityId: sessionId,
      categoria: 'SEGURIDAD',
      details: {
        evaluadoId: session.userId,
        scoreIntegridad: session.scoreIntegridad,
        totalIncidentes: session.incidentes?.length || 0,
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="dictamen-forense-${sessionId.slice(0, 8)}.pdf"`);
    res.end(buffer);
  }

  @Get('bitacora')
  @ApiOperation({ summary: 'CU26 – Consultar bitácora WORM inmutable con filtros avanzados' })
  async consultarBitacora(
    @Query('categoria') categoria?: string,
    @Query('accion') accion?: string,
    @Query('busqueda') busqueda?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const res = await this.bitacora.consultarRegistros({
      categoria,
      accion,
      busqueda,
      fechaInicio,
      fechaFin,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    return res;
  }

  @Get('bitacora/estadisticas')
  @ApiOperation({ summary: 'CU26 – Estadísticas y métricas de la bitácora WORM' })
  async obtenerEstadisticas() {
    return this.bitacora.obtenerEstadisticas();
  }

  @Get('bitacora/verificar')
  @ApiOperation({ summary: 'CU26 – Verificar matemáticamente la integridad de la cadena SHA-256' })
  async verificarCadena() {
    return this.bitacora.verificarIntegridadCadena();
  }

  @Get('bitacora/exportar')
  @ApiOperation({ summary: 'CU26 – Exportar registros WORM a CSV' })
  async exportarCsv(@Query('categoria') categoria?: string, @Res() res?: Response) {
    const csv = await this.bitacora.exportarCsv(categoria);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bitacora-inmutable-worm.csv"');
    res.send(csv);
  }

  @Get('bitacora/exportar-json')
  @ApiOperation({ summary: 'CU26 – Exportar registros WORM con metadata criptográfica a JSON' })
  async exportarJson(@Query('categoria') categoria?: string, @Res() res?: Response) {
    const json = await this.bitacora.exportarJson(categoria);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="bitacora-inmutable-worm.json"');
    res.send(JSON.stringify(json, null, 2));
  }
}
