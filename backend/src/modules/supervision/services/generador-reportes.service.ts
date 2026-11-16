import { Injectable } from '@nestjs/common';
import { ReporteForensePdfBuilder } from './reporte-forense-pdf.builder';
import { ReporteErgonomicoExcelBuilder } from './reporte-ergonomico-excel.builder';

@Injectable()
export class GeneradorReportesService {
  async generarReporteErgonomicoExcel(datos: any): Promise<Buffer> {
    return ReporteErgonomicoExcelBuilder.generar(datos);
  }

  async generarReporteForensePdf(sesion: any): Promise<Buffer> {
    return ReporteForensePdfBuilder.generar(sesion);
  }
}
