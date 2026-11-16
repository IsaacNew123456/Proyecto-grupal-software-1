const assert = require('assert');
const { io } = require('../../frontend/node_modules/socket.io-client');

async function testCu21WebSocket() {
  console.log('\n============================================================');
  console.log('   PRUEBA ESPECÍFICA CU21: CONSOLA DE MONITOREO MOSAICO WSS  ');
  console.log('============================================================\n');

  return new Promise((resolve, reject) => {
    const supervisorSocket = io('http://localhost:3000/supervision', {
      transports: ['websocket'],
      reconnection: false,
    });

    let puestoRegistrado = false;
    let estadoNaranjaRecibido = false;

    supervisorSocket.on('connect', () => {
      console.log('  ✓ Supervisor conectado exitosamente al namespace /supervision');

      // Simulamos la estación de un evaluado
      const evaluadoSocket = io('http://localhost:3000/supervision', {
        transports: ['websocket'],
        reconnection: false,
      });

      evaluadoSocket.on('connect', () => {
        console.log('  ✓ Evaluado conectado. Emitiendo registrar_puesto...');
        evaluadoSocket.emit('registrar_puesto', {
          sessionId: 'sesion-test-cu21',
          usuarioNombre: 'Carlos Mendoza (Demo Postulante)',
          tipo: 'EXAMEN',
        });

        // Esperar 500ms y emitir alerta ergonómica NARANJA
        setTimeout(() => {
          console.log('  ✓ Emitiendo alerta NARANJA (Riesgo ergonómico RULA 5)...');
          evaluadoSocket.emit('actualizar_estado', {
            sessionId: 'sesion-test-cu21',
            estado: 'NARANJA',
            rulaScore: 5,
            pitchEfectivo: -28.5,
            motivo: 'Inclinación de cuello sostenida > 20°',
          });
        }, 600);

        // Esperar 1200ms y desconectar para verificar transición
        setTimeout(() => {
          console.log('  ✓ Desconectando evaluado para verificar desconexión...');
          evaluadoSocket.disconnect();
        }, 1200);
      });

      evaluadoSocket.on('error', (err) => {
        console.error('Error evaluado socket:', err);
      });
    });

    supervisorSocket.on('puestos_actualizados', (puestos) => {
      console.log(`  [WSS Event] Puestos actualizados recibidos. Total puestos: ${puestos.length}`);
      const miPuesto = puestos.find((p) => p.sessionId === 'sesion-test-cu21');
      if (miPuesto) {
        console.log(`    -> Estado actual del puesto: [${miPuesto.estado}] - Motivo: ${miPuesto.motivoAlerta || 'Normal'}`);
        if (miPuesto.estado === 'VERDE') {
          puestoRegistrado = true;
        }
        if (miPuesto.estado === 'NARANJA') {
          estadoNaranjaRecibido = true;
        }
        if (miPuesto.estado === 'GRIS') {
          console.log('    ✓ Puesto conmutó exitosamente a GRIS tras desconexión');
          assert.ok(puestoRegistrado, 'Debe haber pasado por VERDE');
          assert.ok(estadoNaranjaRecibido, 'Debe haber pasado por NARANJA');
          supervisorSocket.disconnect();
          resolve(true);
        }
      }
    });

    supervisorSocket.on('connect_error', (err) => {
      console.error('Error de conexión supervisor:', err.message);
      reject(err);
    });

    setTimeout(() => {
      if (!estadoNaranjaRecibido) {
        supervisorSocket.disconnect();
        reject(new Error('Timeout esperando eventos de CU21 en WebSocket'));
      }
    }, 6000);
  });
}

testCu21WebSocket()
  .then(() => {
    console.log('\n  ✓ CU21 (Mosaico en Tiempo Real por WebSocket) VERIFICADO AL 100%\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ ERROR EN PRUEBA CU21:', err.message);
    process.exit(1);
  });
