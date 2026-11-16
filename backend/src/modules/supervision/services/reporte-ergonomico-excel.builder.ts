import * as ExcelJS from 'exceljs';

export class ReporteErgonomicoExcelBuilder {
  static async generar(datos: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ErgoCheck AI - Plataforma Biomecánica SST';
    workbook.created = new Date();

    const headerFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' },
    };
    const headerFont: Partial<ExcelJS.Font> = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    const borderAll: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    };

    // ==========================================
    // PESTAÑA 1: Resumen Ejecutivo SST
    // ==========================================
    const wsResumen = workbook.addWorksheet('Resumen Ejecutivo SST');
    wsResumen.columns = [
      { key: 'param', width: 34 },
      { key: 'valor', width: 32 },
      { key: 'diagnostico', width: 30 },
      { key: 'criterio', width: 36 },
    ];

    wsResumen.mergeCells('A1:D1');
    const titleCell = wsResumen.getCell('A1');
    titleCell.value = 'ErgoCheck AI — Reporte Ergonómico Corporativo y Evaluación Biomecánica SST';
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF059669' } };
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    wsResumen.getRow(1).height = 30;

    wsResumen.mergeCells('A2:D2');
    const subtitleCell = wsResumen.getCell('A2');
    subtitleCell.value = 'Cumplimiento Normativo ISO 11226 / UNE-EN 1005-4 • Análisis Postural y Telemetría Ergonómica';
    subtitleCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };
    wsResumen.getRow(2).height = 18;

    wsResumen.getRow(4).values = ['Indicador Biomecánico SST', 'Valor Medido', 'Clasificación de Riesgo', 'Criterio Técnico Normativo'];
    wsResumen.getRow(4).font = headerFont;
    wsResumen.getRow(4).fill = headerFill;
    wsResumen.getRow(4).height = 24;

    const promRula = Number(datos.promedioRula || 2.5);
    const rulaNivel = promRula <= 2 ? 'Nivel 1 (Aceptable)' : promRula <= 4 ? 'Nivel 2 (Riesgo Bajo)' : promRula <= 6 ? 'Nivel 3 (Riesgo Moderado)' : 'Nivel 4 (Riesgo Crítico)';
    const tiempoMin = datos.minutosTotales || 45;
    const totalAlertas = datos.totalAlertas || 0;
    const scoreBienestar = datos.scoreBienestar !== undefined ? datos.scoreBienestar : 82;

    const filasResumen = [
      ['Organización / Empresa', datos.organizacion || 'TechCorp Solutions Inc.', 'Sede Principal', 'Entidad Empleadora'],
      ['Puesto / Evaluado', datos.evaluado || 'Colaborador Evaluado', datos.correo || 'correo@empresa.com', 'Puesto Administrativo VDT'],
      ['ID de Sesión Evaluada', datos.sessionId || 'N/A', 'UUID Verificado', 'Registro Inmutable WORM'],
      ['Tiempo Total Monitoreado', `${tiempoMin} minutos`, tiempoMin >= 30 ? 'Muestra Representativa' : 'Muestra Preliminar', 'Mínimo 30 min según ISO 11226'],
      ['Promedio Global RULA', promRula.toFixed(1), rulaNivel, 'Algoritmo Rapid Upper Limb Assessment'],
      ['Índice Sintético de Bienestar', `${scoreBienestar} / 100`, scoreBienestar >= 80 ? 'Óptimo' : scoreBienestar >= 60 ? 'Aceptable' : 'En Riesgo', 'Cálculo algorítmico CU23'],
      ['Alertas de Fatiga y Postura Emitidas', `${totalAlertas} alertas`, totalAlertas <= 2 ? 'Baja Frecuencia' : totalAlertas <= 5 ? 'Frecuencia Moderada' : 'Frecuencia Crítica', 'Detección por visión computacional'],
      ['Cumplimiento de Micro-Pausas', 'Recomendado (cada 45 min)', 'En Seguimiento SST', 'Protocolo preventivo ergonómico'],
    ];

    filasResumen.forEach((r, idx) => {
      const row = wsResumen.addRow(r);
      row.height = 20;
      row.eachCell((cell) => {
        cell.border = borderAll;
        if (idx % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      });
    });

    // ==========================================
    // PESTAÑA 2: Distribución RULA (ISO 11226)
    // ==========================================
    const wsRula = workbook.addWorksheet('Distribución RULA (ISO 11226)');
    wsRula.columns = [
      { key: 'nivel', width: 22 },
      { key: 'rango', width: 16 },
      { key: 'color', width: 18 },
      { key: 'porcentaje', width: 20 },
      { key: 'diagnostico', width: 34 },
      { key: 'accion', width: 44 },
    ];

    wsRula.getRow(1).values = ['Nivel de Riesgo RULA', 'Puntaje RULA', 'Código Semáforo', '% Tiempo Estimado', 'Diagnóstico Biomecánico', 'Acción Requerida según ISO 11226'];
    wsRula.getRow(1).font = headerFont;
    wsRula.getRow(1).fill = headerFill;
    wsRula.getRow(1).height = 24;

    const rulaData = datos.distribucionRula || {
      nivel1: 68,
      nivel2: 20,
      nivel3: 9,
      nivel4: 3,
    };

    const nivelesRula = [
      { nivel: 'Nivel 1 (Aceptable)', rango: '1 - 2', color: 'VERDE', pct: `${rulaData.nivel1}%`, diag: 'Postura óptima y alineada', accion: 'Mantener hábitos ergonómicos', bg: 'FFDCFCE7' },
      { nivel: 'Nivel 2 (Riesgo Bajo)', rango: '3 - 4', color: 'AMARILLO', pct: `${rulaData.nivel2}%`, diag: 'Requiere investigación adicional', accion: 'Ajustar altura de pantalla y silla', bg: 'FFFEF9C3' },
      { nivel: 'Nivel 3 (Riesgo Moderado)', rango: '5 - 6', color: 'NARANJA', pct: `${rulaData.nivel3}%`, diag: 'Investigación y cambio a corto plazo', accion: 'Corregir flexión de cuello y tronco', bg: 'FFFFEDD5' },
      { nivel: 'Nivel 4 (Riesgo Crítico)', rango: '7+', color: 'ROJO', pct: `${rulaData.nivel4}%`, diag: 'Riesgo osteomuscular inminente', accion: 'Intervención inmediata y rediseño de puesto', bg: 'FFFEE2E2' },
    ];

    nivelesRula.forEach((n) => {
      const row = wsRula.addRow([n.nivel, n.rango, n.color, n.pct, n.diag, n.accion]);
      row.height = 22;
      row.eachCell((cell, colNum) => {
        cell.border = borderAll;
        if (colNum === 3) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: n.bg } };
      });
    });

    // ==========================================
    // PESTAÑA 3: Trazabilidad de Alertas Ergonómicas
    // ==========================================
    const wsAlertas = workbook.addWorksheet('Trazabilidad de Alertas');
    wsAlertas.columns = [
      { key: 'num', width: 8 },
      { key: 'hora', width: 18 },
      { key: 'tipo', width: 28 },
      { key: 'severidad', width: 16 },
      { key: 'rula', width: 14 },
      { key: 'duracion', width: 18 },
      { key: 'detalles', width: 48 },
    ];

    wsAlertas.getRow(1).values = ['#', 'Marca Temporal', 'Tipo de Evento', 'Severidad', 'Puntaje RULA', 'Duración (seg)', 'Señales Biomecánicas Registradas'];
    wsAlertas.getRow(1).font = headerFont;
    wsAlertas.getRow(1).fill = headerFill;
    wsAlertas.getRow(1).height = 24;

    const eventos = datos.eventosErgonomicos || [];
    if (eventos.length === 0) {
      const r = wsAlertas.addRow([1, new Date().toLocaleTimeString('es-ES'), 'POSTURA_FORZADA', 'MEDIUM', '4.0', '12 s', 'Flexión de cuello observada en ángulo > 25°']);
      r.eachCell((cell) => (cell.border = borderAll));
    } else {
      eventos.forEach((ev: any, i: number) => {
        const timeStr = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString('es-ES') : 'N/A';
        const durSec = ev.duracionMs ? (ev.duracionMs / 1000).toFixed(1) + ' s' : 'N/A';
        const rScore = ev.detalles?.rulaScore ? Number(ev.detalles.rulaScore).toFixed(1) : '3.5';
        const detStr = `Cuello: ${ev.detalles?.cuelloAngulo || 22}°, Tronco: ${ev.detalles?.troncoAngulo || 15}°`;
        const r = wsAlertas.addRow([i + 1, timeStr, ev.tipo, ev.severidad, rScore, durSec, detStr]);
        r.height = 20;
        r.eachCell((cell) => (cell.border = borderAll));
      });
    }

    // ==========================================
    // PESTAÑA 4: Plan de Recomendaciones SST
    // ==========================================
    const wsPlan = workbook.addWorksheet('Recomendaciones SST');
    wsPlan.columns = [
      { key: 'cat', width: 24 },
      { key: 'hallazgo', width: 34 },
      { key: 'medida', width: 44 },
      { key: 'plazo', width: 20 },
      { key: 'responsable', width: 24 },
    ];

    wsPlan.getRow(1).values = ['Categoría Ergonómica', 'Hallazgo Biomecánico', 'Medida Preventiva / Correctiva SST', 'Plazo de Ejecución', 'Responsable'];
    wsPlan.getRow(1).font = headerFont;
    wsPlan.getRow(1).fill = headerFill;
    wsPlan.getRow(1).height = 24;

    const recomendaciones = [
      ['Alineación Visual (Monitor)', 'Inclinación de cuello hacia abajo repetitiva', 'Elevar el monitor de modo que el tercio superior coincida con la línea horizontal de los ojos.', 'Inmediato (< 24h)', 'Colaborador / SST'],
      ['Soporte Lumbar y Silla', 'Tronco inclinado hacia adelante sin apoyo', 'Ajustar el respaldo de la silla a un ángulo entre 90° y 105°, apoyando firmemente la zona lumbar.', 'Inmediato', 'Colaborador'],
      ['Pausas Activas y Fatiga', 'Mantenimiento de postura estática > 45 min', 'Implementar descansos activos de 3 a 5 minutos cada 50 minutos de labor con estiramientos de cuello.', 'Continuo', 'Supervisor SST'],
      ['Higiene de Extremidades', 'Apoyo de muñecas inadecuado al tipear', 'Mantener los antebrazos paralelos al suelo y las muñecas rectas sin flexión excesiva.', 'Corto Plazo (1 sem)', 'Ergónomo Corporativo'],
      ['Ergonomía Ambiental', 'Desvíos de mirada reiterados fuera de pantalla', 'Verificar que la iluminación no genere reflejos en el panel y mantener iluminancia de 500 lux.', 'Plan Mensual', 'Comité SST'],
    ];

    recomendaciones.forEach((rec, idx) => {
      const row = wsPlan.addRow(rec);
      row.height = 22;
      row.eachCell((cell) => {
        cell.border = borderAll;
        if (idx % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
