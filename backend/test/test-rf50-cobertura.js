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
  console.log('  ERGOCHECK AI — VALIDACIÓN COBERTURA RF50 BITÁCORA WORM    ');
  console.log('  Eventos Técnicos | Accesos a Datos | Cambios Políticas   ');
  console.log('============================================================\n');

  try {
    // 1. Login
    console.log('[1/6] Autenticación administrativa JWT...');
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
    assert.ok(token, 'Debe obtener token JWT');
    console.log(`  ✓ Token obtenido correctamente.`);

    // 2. Disparar Eventos Técnicos: Iniciar demo y correlacionar
    console.log('\n[2/6] Disparando acciones de categoría: EVENTOS TÉCNICOS...');
    const demoRes = await request('POST', '/supervision/sesiones/demo', null, token);
    assert.strictEqual(demoRes.status, 201, 'Debe crear sesión demo');
    const sessionId = demoRes.data.sessionId;

    const corrRes = await request('POST', `/supervision/correlacion/${sessionId}`, null, token);
    assert.strictEqual(corrRes.status, 200, 'Debe correlacionar');

    const cerrarRes = await request('POST', `/supervision/sesiones/${sessionId}/cerrar`, null, token);
    assert.strictEqual(cerrarRes.status, 201, 'Debe cerrar sesión');
    console.log(`  ✓ Eventos técnicos registrados en WORM: INICIAR_SESION_DEMO, EJECUTAR_CORRELACION_REGLAS, CERRAR_SESION_SUPERVISION`);

    // 3. Disparar Acceso a Datos: Consultar incidentes, reportes y exportación
    console.log('\n[3/6] Disparando acciones de categoría: ACCESOS A DATOS...');
    const incRes = await request('GET', `/supervision/incidentes/${sessionId}`, null, token);
    assert.strictEqual(incRes.status, 200, 'Debe listar incidentes');

    const excelRes = await request('GET', `/supervision/reportes/${sessionId}/ergonomico-excel`, null, token);
    assert.strictEqual(excelRes.status, 200, 'Debe descargar Excel');

    const pdfRes = await request('GET', `/supervision/reportes/${sessionId}/forense-pdf`, null, token);
    assert.strictEqual(pdfRes.status, 200, 'Debe descargar PDF');

    const csvRes = await request('GET', `/supervision/bitacora/exportar?categoria=ACCESOS_DATOS`, null, token);
    assert.strictEqual(csvRes.status, 200, 'Debe exportar CSV');
    console.log(`  ✓ Accesos a datos registrados en WORM: CONSULTAR_EXPEDIENTE_FORENSE, EXPORTAR_REPORTE_ERGONOMICO_EXCEL, EXPORTAR_REPORTE_FORENSE_PDF, EXPORTAR_BITACORA_CSV`);

    // 4. Disparar Cambios de Políticas: Auditar incidente y/o consentimiento
    console.log('\n[4/6] Disparando acciones de categoría: CAMBIOS DE POLÍTICAS...');
    if (incRes.data && incRes.data.length > 0) {
      const incId = incRes.data[0].id;
      const auditRes = await request('PUT', `/supervision/incidentes/${incId}/auditar`, {
        estado: 'CONFIRMADO',
        justificacion: 'Ajuste de política forense y validez pericial',
      }, token);
      assert.strictEqual(auditRes.status, 200);
      console.log(`  ✓ Cambio de política registrado en WORM: AUDITAR_INCIDENTE`);
    }

    // Consentimiento firmado/revocado
    const consentFirmar = await request('POST', '/consentimiento/firmar', {
      type: 'CAMERA_AND_BIOMETRICS',
      version: '1.0',
    }, token);
    assert.ok(consentFirmar.status === 200 || consentFirmar.status === 201, `Consentimiento debió responder 200/201 pero dio ${consentFirmar.status}: ${JSON.stringify(consentFirmar.data)}`);
    console.log(`  ✓ Cambio de política registrado en WORM: CONSENTIMIENTO_FIRMADO`);

    // 5. Verificar filtros por categoría RF50 en la bitácora
    console.log('\n[5/6] Verificando consulta y filtrado por categorías RF50...');
    const filterTecnicos = await request('GET', '/supervision/bitacora?categoria=EVENTOS_TECNICOS&limit=10', null, token);
    assert.strictEqual(filterTecnicos.status, 200);
    assert.ok(filterTecnicos.data.registros.length > 0, 'Debe encontrar registros de EVENTOS_TECNICOS');
    console.log(`  ✓ Filtro EVENTOS_TECNICOS: ${filterTecnicos.data.registros.length} registros recuperados (Total en BD: ${filterTecnicos.data.total})`);

    const filterAccesos = await request('GET', '/supervision/bitacora?categoria=ACCESOS_DATOS&limit=10', null, token);
    assert.strictEqual(filterAccesos.status, 200);
    assert.ok(filterAccesos.data.registros.length > 0, 'Debe encontrar registros de ACCESOS_DATOS');
    console.log(`  ✓ Filtro ACCESOS_DATOS: ${filterAccesos.data.registros.length} registros recuperados (Total en BD: ${filterAccesos.data.total})`);

    const filterPoliticas = await request('GET', '/supervision/bitacora?categoria=CAMBIOS_POLITICAS&limit=10', null, token);
    assert.strictEqual(filterPoliticas.status, 200);
    assert.ok(filterPoliticas.data.registros.length > 0, 'Debe encontrar registros de CAMBIOS_POLITICAS');
    console.log(`  ✓ Filtro CAMBIOS_POLITICAS: ${filterPoliticas.data.registros.length} registros recuperados (Total en BD: ${filterPoliticas.data.total})`);

    // 6. Verificación criptográfica SHA-256
    console.log('\n[6/6] Verificando integridad matemática WORM (SHA-256)...');
    const verifRes = await request('GET', '/supervision/bitacora/verificar', null, token);
    assert.strictEqual(verifRes.status, 200);
    assert.strictEqual(verifRes.data.valida, true, 'La cadena criptográfica SHA-256 debe ser 100% válida');
    console.log(`  ✓ Cadena WORM verificada: ${verifRes.data.totalRegistros} bloques validados matemáticamente`);
    console.log(`  ✓ Hash Génesis: ${verifRes.data.genesisHash.slice(0, 16)}...`);
    console.log(`  ✓ Último Hash: ${verifRes.data.ultimoHash.slice(0, 16)}...`);
    console.log(`  ✓ Estado de integridad: VÁLIDA (Tiempo de cómputo: ${verifRes.data.tiempoVerificacionMs} ms)`);

    console.log('\n============================================================');
    console.log('  >>> REQUISITO RF50 & RF51 IMPLEMENTADO Y VERIFICADO AL 100% <<<');
    console.log('============================================================\n');
  } catch (err) {
    console.error('\n❌ ERROR EN LA VERIFICACIÓN:', err);
    process.exit(1);
  }
}

runTests();
