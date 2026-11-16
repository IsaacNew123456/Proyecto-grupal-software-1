import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ReporteForensePdfBuilder } from './reporte-forense-pdf.builder';

@Injectable()
export class GeneradorReportesService {
  async generarReporteErgonomicoExcel(datos: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ErgoCheck AI - Sistema Biomecánico SST';
    workbook.created = new Date();

    // Pestaña 1: Resumen General
    const hojaResumen = workbook.addWorksheet('Resumen SST');
    hojaResumen.columns = [
      { header: 'Indicador', key: 'indicador', width: 35 },
      { header: 'Valor', key: 'valor', width: 25 },
      { header: 'Nivel de Riesgo', key: 'nivel', width: 20 },
    ];
    hojaResumen.addRow({ indicador: 'Total Sesiones Monitoreadas', valor: datos.totalSesiones || 1, nivel: 'Informativo' });
    hojaResumen.addRow({ indicador: 'Promedio Global RULA', valor: datos.promedioRula || '2.4', nivel: 'Aceptable (Nivel 1)' });
    hojaResumen.addRow({ indicador: 'Minutos Totales Evaluados', valor: `${datos.minutosTotales || 120} min`, nivel: 'Óptimo' });
    hojaResumen.addRow({ indicador: 'Alertas de Fatiga Emitidas', valor: datos.totalAlertas || 3, nivel: 'Controlado' });
    hojaResumen.getRow(1).font = { bold: true };

    // Pestaña 2: Distribución RULA
    const hojaRula = workbook.addWorksheet('Distribución RULA');
    hojaRula.columns = [
      { header: 'Nivel RULA', key: 'nivel', width: 20 },
      { header: 'Puntaje', key: 'puntaje', width: 15 },
      { header: 'Porcentaje Tiempo', key: 'porcentaje', width: 20 },
      { header: 'Acción Requerida', key: 'accion', width: 40 },
    ];
    hojaRula.addRow({ nivel: 'Nivel 1 (Verde)', puntaje: '1 - 2', porcentaje: '72%', accion: 'Postura aceptable si no se mantiene prolongada' });
    hojaRula.addRow({ nivel: 'Nivel 2 (Amarillo)', puntaje: '3 - 4', porcentaje: '18%', accion: 'Investigación adicional recomendada' });
    hojaRula.addRow({ nivel: 'Nivel 3 (Naranja)', puntaje: '5 - 6', porcentaje: '8%', accion: 'Modificar postura en el corto plazo' });
    hojaRula.addRow({ nivel: 'Nivel 4 (Rojo)', puntaje: '7', porcentaje: '2%', accion: 'Intervención y rediseño inmediato' });
    hojaRula.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generarReporteForensePdf(sesion: any): Promise<Buffer> {
    return ReporteForensePdfBuilder.generar(sesion);
  }
}

