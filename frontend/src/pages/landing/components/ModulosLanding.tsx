import React from 'react';
import { Activity, ShieldAlert, Monitor, FileSpreadsheet, Sparkles } from 'lucide-react';

export const ModulosLanding: React.FC = () => {
  const modulos = [
    {
      id: 'rula',
      icono: Activity,
      colorIcono: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      etiqueta: 'Salud Ocupacional SST',
      titulo: 'Evaluación Ergonómica RULA en Vivo',
      descripcion:
        'Inferencia articular 1:1 en el navegador. Clasifica el riesgo biomecánico en 4 niveles de acción (ISO 11226) y dispara micro-pausas activas para prevenir fatiga muscular.',
      caracteristicas: [
        'Esqueleto biomecánico procesado en Web Worker',
        'Cálculo de ángulos de cuello, tronco y brazos',
        'Pausas activas ErgoBreak con guía interactiva',
      ],
    },
    {
      id: 'supervision',
      icono: ShieldAlert,
      colorIcono: 'text-amber-600 bg-amber-50 border-amber-200',
      etiqueta: 'Integridad y Proctoring',
      titulo: 'Supervisión Ocular y Detección Anti-Fraude',
      descripcion:
        'Resolución de pose de cabeza mediante PnP y seguimiento de mirada por desplazamiento del iris. Detecta desvíos persistentes hacia dispositivos móviles o pantallas ocultas.',
      caracteristicas: [
        'Detección de ausencia y presencia de múltiples rostros',
        'Telemetría de pérdida de foco y atajos de teclado',
        'Modo entrevista con preguntas dinámicas y blendshapes',
      ],
    },
    {
      id: 'mosaico',
      icono: Monitor,
      colorIcono: 'text-blue-600 bg-blue-50 border-blue-200',
      etiqueta: 'Supervisión en Tiempo Real',
      titulo: 'Consola Mosaico con Semáforo WebSocket',
      descripcion:
        'Monitoreo simultáneo de múltiples puestos remotos mediante WebSockets. Código de colores instantáneo con watchdog timer que marca puestos desconectados en gris a los 15s.',
      caracteristicas: [
        'Semáforo visual: Verde, Amarillo, Naranja, Rojo y Gris',
        'Motor de correlación multidimensional en 60s',
        'Línea de tiempo de incidentes y auditoría humana',
      ],
    },
    {
      id: 'reportes',
      icono: FileSpreadsheet,
      colorIcono: 'text-purple-600 bg-purple-50 border-purple-200',
      etiqueta: 'Reportería Forense & Auditoría',
      titulo: 'Bitácora Inmutable WORM y Reportes',
      descripcion:
        'Registro criptográfico con cadena de hashes SHA-256 para prevenir alteración de pruebas. Emisión de reportes corporativos en Excel (.xlsx) y dictámenes forenses en PDF.',
      caracteristicas: [
        'Exportación de bitácora en JSON y CSV verificable',
        'Reportes ergonómicos consolidados por departamento',
        'Dictamen pericial individual con firma y sello digital',
      ],
    },
  ];

  return (
    <section id="modulos" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Capacidades de Grado Empresarial
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Todo lo necesario para SST y Evaluaciones en una sola suite
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Diseñado para cumplir con normativas laborales, directrices de medicina ocupacional y
            estándares internacionales de privacidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modulos.map((mod) => {
            const Icono = mod.icono;
            return (
              <div
                key={mod.id}
                className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${mod.colorIcono}`}>
                      <Icono className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {mod.etiqueta}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{mod.titulo}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{mod.descripcion}</p>
                </div>

                <ul className="mt-6 pt-6 border-t border-slate-200/60 space-y-2.5">
                  {mod.caracteristicas.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
