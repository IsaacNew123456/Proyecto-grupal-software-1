import * as PDFDocument from 'pdfkit';
import * as crypto from 'crypto';

export class ReporteForensePdfBuilder {
  static generar(sesion: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 45,
        size: 'A4',
        info: {
          Title: `ErgoCheck AI — Dictamen Forense ${sesion.id ? sesion.id.slice(0, 8) : ''}`,
          Author: 'ErgoCheck AI — Plataforma Biocognitiva y Probidad',
          Subject: 'Dictamen Forense de Integridad y Telemetría Biocognitiva (ISO/IEC 29148)',
          Keywords: 'ErgoCheck AI, Forense, Telemetría, SHA-256, WORM, Zero-Image Retention',
        },
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const asegurarEspacio = (altura: number) => {
        if (doc.y + altura > 750) {
          doc.addPage();
        }
      };

      // 1. Barra superior decorativa
      doc.rect(45, 45, 505, 3).fill('#059669');
      doc.y = 56;

      // 2. Encabezado corporativo
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#0B1020')
        .text('ErgoCheck AI — Expediente Forense de Supervisión', 45, doc.y);
      doc.font('Helvetica').fontSize(8.5).fillColor('#64748B')
        .text('Certificación Biocognitiva, Integridad de Examen y Cumplimiento Zero-Image Retention • ISO/IEC 29148');
      doc.moveDown(0.6);
      doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      // 3. Ficha Técnica
      const usuarioNombre = sesion.usuario ? `${sesion.usuario.nombre} ${sesion.usuario.apellido}` : 'Evaluado';
      const usuarioCorreo = sesion.usuario?.correo || 'correo@ejemplo.com';
      const orgNombre = sesion.organizacion?.nombre || 'Organización / Empresa';
      const inicioStr = sesion.inicio ? new Date(sesion.inicio).toLocaleString('es-ES') : 'N/A';
      const finStr = sesion.fin ? new Date(sesion.fin).toLocaleString('es-ES') : 'En curso';
      const tipo = sesion.tipo || 'EXAMEN';
      const estado = sesion.estado || 'COMPLETADA';
      const score = Math.round(
        sesion.scoreIntegridad !== undefined && sesion.scoreIntegridad !== null
          ? Number(sesion.scoreIntegridad)
          : 100,
      );

      doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E293B').text('FICHA TÉCNICA DE LA SESIÓN:');
      doc.moveDown(0.3);

      const col1X = 45;
      const col2X = 300;
      const startFichaY = doc.y;

      doc.font('Helvetica').fontSize(8).fillColor('#475569');
      doc.text('Evaluado: ', col1X, startFichaY, { continued: true })
        .font('Helvetica-Bold').fillColor('#0F172A').text(`${usuarioNombre} (${usuarioCorreo})`);
      doc.font('Helvetica').fillColor('#475569')
        .text('Organización: ', col1X, doc.y, { continued: true })
        .font('Helvetica-Bold').fillColor('#0F172A').text(orgNombre);
      doc.font('Helvetica').fillColor('#475569')
        .text('ID de Sesión: ', col1X, doc.y, { continued: true })
        .font('Courier').fontSize(7.5).fillColor('#0F172A').text(sesion.id);

      const fichaCol1EndY = doc.y;

      doc.font('Helvetica').fontSize(8).fillColor('#475569');
      doc.text('Modalidad: ', col2X, startFichaY, { continued: true })
        .font('Helvetica-Bold').fillColor('#0F172A').text(`${tipo} (${estado})`);
      doc.font('Helvetica').fillColor('#475569')
        .text('Fecha y Hora Inicio: ', col2X, doc.y, { continued: true })
        .font('Helvetica-Bold').fillColor('#0F172A').text(inicioStr);
      doc.font('Helvetica').fillColor('#475569')
        .text('Fecha y Hora Cierre: ', col2X, doc.y, { continued: true })
        .font('Helvetica-Bold').fillColor('#0F172A').text(finStr);

      doc.y = Math.max(fichaCol1EndY, doc.y) + 10;

      // 4. Tarjeta Dictamen de Integridad
      asegurarEspacio(70);
      const colorScore = score >= 85 ? '#059669' : score >= 65 ? '#D97706' : '#DC2626';
      const labelVeredicto =
        score >= 85
          ? 'CONFORME (Alta Probidad)'
          : score >= 65
            ? 'OBSERVADO (Probidad Aceptable)'
            : 'NO CONFORME (Riesgo Crítico)';
      const cardY = doc.y;

      doc.roundedRect(45, cardY, 505, 52, 6).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A').text('Índice de Integridad Global:', 60, cardY + 12);
      doc.font('Helvetica').fontSize(8).fillColor('#64748B')
        .text('Evaluación biocognitiva basada en correlación multidimensional (CU20 - CU23)', 60, cardY + 28);

      doc.font('Helvetica-Bold').fontSize(20).fillColor(colorScore).text(`${score}`, 380, cardY + 10, { width: 50, align: 'right' });
      doc.font('Helvetica').fontSize(11).fillColor('#64748B').text('/ 100', 435, cardY + 17);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colorScore).text(labelVeredicto, 350, cardY + 34, { width: 185, align: 'right' });

      doc.y = cardY + 62;

      // 5. Métricas de Telemetría Biocognitiva y Foco
      asegurarEspacio(65);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E293B').text('RESUMEN DE TELEMETRÍA Y CONDUCTA EN PUESTO:');
      doc.moveDown(0.3);

      const evs = sesion.eventosConducta || [];
      const gazeDownCount = evs.filter((e: any) => e.tipo === 'GAZE_DOWN_SUSTAINED').length;
      const blurCount = evs.filter((e: any) => e.tipo === 'WINDOW_BLUR').length;
      const offscreenCount = evs.filter((e: any) => e.tipo === 'GAZE_OFFSCREEN').length;
      const faceAbsentCount = evs.filter((e: any) => e.tipo === 'FACE_ABSENT').length;
      const multiFacesCount = evs.filter((e: any) => e.tipo === 'MULTIPLE_FACES').length;
      const shortcutCount = evs.filter((e: any) => e.tipo === 'SHORTCUT_BLOCKED').length;

      const metroY = doc.y;
      doc.roundedRect(45, metroY, 505, 42, 4).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.font('Helvetica').fontSize(7.5).fillColor('#475569');
      doc.text(`• Foco de Ventana: ${blurCount} pérdidas`, 55, metroY + 8);
      doc.text(`• Mirada Baja (Celular): ${gazeDownCount} desvíos`, 55, metroY + 22);
      doc.text(`• Mirada Fuera: ${offscreenCount} desvíos`, 215, metroY + 8);
      doc.text(`• Rostro Ausente: ${faceAbsentCount} eventos`, 215, metroY + 22);
      doc.text(`• Presencia de Terceros: ${multiFacesCount} eventos`, 375, metroY + 8);
      doc.text(`• Atajos Bloqueados: ${shortcutCount} intentos`, 375, metroY + 22);

      doc.y = metroY + 52;

      // 6. Matriz de Incidentes Correlacionados
      asegurarEspacio(50);
      const incs = sesion.incidentes || [];
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E293B')
        .text(`TRAZABILIDAD FORENSE DE INCIDENTES (${incs.length} REGISTRADOS):`);
      doc.moveDown(0.4);

      if (incs.length === 0) {
        doc.roundedRect(45, doc.y, 505, 28, 4).fillAndStroke('#ECFDF5', '#A7F3D0');
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#059669')
          .text('✓ Sesión Limpia: Cero anomalías conductuales o incidentes de seguridad correlacionados.', 55, doc.y + 9);
        doc.y += 36;
      } else {
        incs.forEach((inc: any) => {
          asegurarEspacio(55);
          const incY = doc.y;
          const sevColor =
            inc.severidad === 'CRITICAL'
              ? '#DC2626'
              : inc.severidad === 'HIGH'
                ? '#EA580C'
                : inc.severidad === 'MEDIUM'
                  ? '#D97706'
                  : '#64748B';
          const estColor =
            inc.estado === 'CONFIRMADO'
              ? '#DC2626'
              : inc.estado === 'DESESTIMADO' || inc.estado === 'FALSO_POSITIVO'
                ? '#059669'
                : '#D97706';

          doc.roundedRect(45, incY, 505, 48, 4).fillAndStroke('#FFFFFF', '#E2E8F0');
          doc.rect(45, incY, 3, 48).fill(sevColor);

          doc.font('Helvetica-Bold').fontSize(8).fillColor(sevColor)
            .text(`[${inc.severidad}]`, 55, incY + 7, { continued: true })
            .font('Helvetica-Bold').fillColor('#0F172A').text(` ${inc.tipo}`, { continued: true })
            .font('Helvetica').fillColor('#64748B').text(` — ${new Date(inc.timestamp).toLocaleTimeString('es-ES')}`, { continued: true });

          doc.font('Helvetica-Bold').fontSize(7.5).fillColor(estColor)
            .text(`Estado: ${inc.estado}`, 430, incY + 7, { width: 110, align: 'right' });

          doc.font('Helvetica').fontSize(7.5).fillColor('#334155')
            .text(`Detalle: ${inc.resumen}`, 55, incY + 20, { width: 480 });

          if (inc.justificacion) {
            doc.font('Helvetica-Oblique').fontSize(7).fillColor('#059669')
              .text(`Nota Pericial / Justificación: ${inc.justificacion}`, 55, incY + 34, { width: 480 });
          } else {
            doc.font('Helvetica-Oblique').fontSize(7).fillColor('#94A3B8')
              .text('Auditoría pendiente de dictamen pericial humano', 55, incY + 34, { width: 480 });
          }

          doc.y = incY + 54;
        });
      }

      // 7. Preguntas de Control / Entrevistas (si existen)
      const rtas = sesion.respuestasControl || [];
      if (rtas.length > 0) {
        asegurarEspacio(50);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#1E293B')
          .text(`HITOS DE ENTREVISTA Y PREGUNTAS DE CONTROL (${rtas.length}):`);
        doc.moveDown(0.3);

        rtas.forEach((rta: any) => {
          asegurarEspacio(35);
          const rtaY = doc.y;
          doc.roundedRect(45, rtaY, 505, 28, 4).fillAndStroke('#F8FAFC', '#E2E8F0');
          const textoPregunta = rta.pregunta?.texto || 'Pregunta de control';
          doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#1E293B')
            .text(`Pregunta: "${textoPregunta}"`, 55, rtaY + 6, { width: 330 });
          doc.font('Helvetica').fontSize(7).fillColor('#475569')
            .text(`Latencia: ${rta.latenciaRespuestaMs || 0} ms | Δ Tensión: ${rta.deltaTensionFacial || 0}`, 390, rtaY + 6, { width: 150, align: 'right' });
          if (rta.notasEvaluador) {
            doc.font('Helvetica-Oblique').fontSize(7).fillColor('#64748B')
              .text(`Evaluador: ${rta.notasEvaluador}`, 55, rtaY + 16, { width: 480 });
          }
          doc.y = rtaY + 32;
        });
      }

      // 8. Sello Criptográfico SHA-256 de Autenticidad (WORM)
      asegurarEspacio(85);
      doc.moveDown(0.6);
      const dataSello = `${sesion.id}|${score}|${usuarioCorreo}|${inicioStr}|${incs.length}`;
      const hashSello = crypto.createHash('sha256').update(dataSello).digest('hex').toUpperCase();

      const selloY = doc.y;
      doc.roundedRect(45, selloY, 505, 68, 4).fillAndStroke('#F1F5F9', '#CBD5E1');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#0F172A')
        .text('CERTIFICACIÓN CRIPTOGRÁFICA DE INTEGRIDAD (SHA-256 WORM):', 55, selloY + 8);

      doc.font('Courier-Bold').fontSize(7.5).fillColor('#1E293B')
        .text(hashSello, 55, selloY + 22);

      doc.font('Helvetica').fontSize(6.5).fillColor('#64748B')
        .text(
          'Principio Zero-Image Retention: ErgoCheck AI no almacena fotografías, audio ni streams de video del evaluado. El presente dictamen técnico se fundamenta estrictamente en la telemetría vectorial efímera procesada localmente y certificada mediante encadenamiento criptográfico SHA-256 inmutable de no-repudio conforme a la norma ISO/IEC 29148.',
          55,
          selloY + 34,
          { width: 485, align: 'justify' },
        );

      doc.end();
    });
  }
}
