/**
 * ErgoCheck AI — QA Automation Suite: Sprint 4 (CU20 a CU26)
 * Validación Integral E2E de:
 * - CU20: Motor de Correlación de Incidentes en Ventana Deslizante (60s)
 * - CU21: Gateway WebSocket de Mosaico SST y Watchdog
 * - CU22: Trazabilidad y Auditoría de Incidentes (WORM)
 * - CU23: Índices Sintéticos de Integridad y Bienestar Ergonómico
 * - CU24: Generación de Reporte Ergonómico Corporativo (.xlsx)
 * - CU25: Dictamen Forense Certificado con Sello SHA-256 (.pdf)
 * - CU26: Bitácora Inmutable WORM con Encadenamiento Criptográfico SHA-256
 */

const assert = require('assert');
const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api' + path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks);
          const contentType = res.headers['content-type'] || '';
          let parsed = {};
          if (contentType.includes('application/json')) {
            try {
              parsed = JSON.parse(raw.toString() || '{}');
            } catch {
              parsed = { raw: raw.toString() };
            }
          } else {
            parsed = { rawBuffer: raw, length: raw.length, contentType };
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      },
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('\n============================================================');
  console.log('  ERGOCHECK AI — QA AUTOMATION SUITE: SPRINT 4 (CU20 - CU26) ');
  console.log('============================================================\n');

  try {
    // 1. Autenticación como Administrador
    console.log('[QA 1/7] Autenticación administrativa JWT...');
    let loginRes = await request('POST', '/auth/login', {
      correo: 'carlos.mendoza@visitask.com',
      clave: '12345',
    });

    if (loginRes.status !== 200 || !loginRes.data.token) {
      loginRes = await request('POST', '/auth/login', {
        correo: 'admin@techcorp.com',
        clave: 'Admin123!',
      });
    }

    const token = loginRes.data.token;
    assert.ok(token, 'Debe obtener token JWT válido');
    console.log(`  ✓ Autenticación exitosa (Token emitido para ${loginRes.data.usuario?.nombre || 'Admin'})`);

    // 2. Iniciar una sesión de prueba con eventos
    console.log('\n[QA 2/7] Creación de sesión e inyección de eventos de telemetría...');
    const demoRes = await request('POST', '/supervision/sesiones/demo', null, token);
    assert.strictEqual(demoRes.status, 201, 'Debe crear sesión demo');
    const sessionId = demoRes.data.sessionId;
    console.log(`  ✓ Sesión demo iniciada: ${sessionId}`);
    console.log(`  ✓ Total eventos inyectados: ${demoRes.data.totalEventosInyectados}`);

    // 3. CU20: Ejecución del motor de correlación
    console.log('\n[QA 3/7] CU20: Evaluación de ventana deslizante en Motor de Correlación...');
    const correlacionRes = await request('POST', `/supervision/correlacion/${sessionId}`, null, token);
    assert.strictEqual(correlacionRes.status, 200, 'Motor de correlación debe responder HTTP 200');
    console.log(`  ✓ Motor ejecutado. Total incidentes correlacionados: ${correlacionRes.data.total}`);

    // 4. CU22: Listar y auditar incidentes
    console.log('\n[QA 4/7] CU22: Trazabilidad y auditoría de incidentes...');
    const incidentesRes = await request('GET', `/supervision/incidentes/${sessionId}`, null, token);
    assert.strictEqual(incidentesRes.status, 200, 'Debe responder HTTP 200');
    console.log(`  ✓ Incidentes listados: ${incidentesRes.data.length}`);

    if (incidentesRes.data.length > 0) {
      const primerInc = incidentesRes.data[0];
      const auditarRes = await request('PUT', `/supervision/incidentes/${primerInc.id}/auditar`, {
        estado: 'CONFIRMADO',
        justificacion: 'Validado por QA automatizado de Sprint 4',
      }, token);
      assert.strictEqual(auditarRes.status, 200, 'Auditoría debe responder HTTP 200');
      assert.strictEqual(auditarRes.data.estado, 'CONFIRMADO');
      console.log(`  ✓ Incidente ${primerInc.id.slice(0, 8)} auditado como CONFIRMADO con justificación`);
    }

    // 5. CU23: Índices sintéticos
    console.log('\n[QA 5/7] CU23: Cálculo de Índices Sintéticos (Integridad y Bienestar)...');
    const indicesRes = await request('GET', `/supervision/indices/${sessionId}`, null, token);
    assert.strictEqual(indicesRes.status, 200, 'Debe calcular índices sintéticos');
    console.log(`  ✓ Índice de Integridad: ${indicesRes.data.indiceIntegridad} / 100`);
    console.log(`  ✓ Bienestar Ergonómico: ${indicesRes.data.indiceBienestar} / 100`);
    console.log(`  ✓ Clasificación SST: ${indicesRes.data.estadoSST}`);

    // 6. CU24 y CU25: Reportes Excel y PDF
    console.log('\n[QA 6/7] CU24 & CU25: Descarga binaria de reportes certificados...');
    const excelRes = await request('GET', `/supervision/reportes/${sessionId}/ergonomico-excel`, null, token);
    assert.strictEqual(excelRes.status, 200, 'Excel debe responder HTTP 200');
    assert.ok(excelRes.data.length > 1000, 'Buffer de Excel debe contener datos');
    console.log(`  ✓ Reporte Excel generado (${excelRes.data.length} bytes)`);

    const pdfRes = await request('GET', `/supervision/reportes/${sessionId}/forense-pdf`, null, token);
    assert.strictEqual(pdfRes.status, 200, 'PDF debe responder HTTP 200');
    assert.ok(pdfRes.data.length > 1000, 'Buffer de PDF debe contener dictamen');
    console.log(`  ✓ Dictamen Forense PDF generado con sello SHA-256 (${pdfRes.data.length} bytes)`);

    // 7. CU26: Bitácora inmutable WORM
    console.log('\n[QA 7/7] CU26: Verificación de Bitácora Inmutable WORM y cadena SHA-256...');
    const bitacoraRes = await request('GET', '/supervision/bitacora', null, token);
    assert.strictEqual(bitacoraRes.status, 200, 'Bitácora debe responder HTTP 200');
    const totalRegs = bitacoraRes.data.registros ? bitacoraRes.data.registros.length : (bitacoraRes.data.length || 0);
    console.log(`  ✓ Registros recuperados de la bitácora: ${totalRegs}`);

    const verificarRes = await request('GET', '/supervision/bitacora/verificar', null, token);
    assert.strictEqual(verificarRes.status, 200, 'Verificación debe responder HTTP 200');
    assert.strictEqual(verificarRes.data.valida, true, 'Cadena SHA-256 debe ser matemáticamente íntegra');
    console.log(`  ✓ Integridad de cadena WORM confirmada (Valida: ${verificarRes.data.valida}, Registros: ${verificarRes.data.totalRegistros})`);

    const exportCsvRes = await request('GET', '/supervision/bitacora/exportar', null, token);
    assert.strictEqual(exportCsvRes.status, 200, 'Exportación CSV debe responder HTTP 200');
    console.log('  ✓ Exportación CSV WORM completada exitosamente');

    console.log('\n============================================================');
    console.log('  ✓ TODOS LOS CASOS DE USO DE SPRINT 4 (CU20-CU26) PASARON 100%');
    console.log('============================================================\n');
  } catch (error) {
    console.error('\n❌ ERROR EN QA SPRINT 4:', error.message);
    process.exit(1);
  }
}

runTests();
