import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Building2 } from 'lucide-react';

export const PlanesLanding: React.FC = () => {
  const planes = [
    {
      tipo: 'SAAS_SEAT_MONTHLY',
      destacado: true,
      icono: Building2,
      nombre: 'Plan Profesional por Puesto',
      descripcion: 'Para organizaciones con equipos en modalidad híbrida, teletrabajo o presencial.',
      precio: '$19',
      periodo: 'USD / puesto / mes',
      caracteristicas: [
        'Evaluación biomecánica RULA (ISO 11226) continua',
        'Alertas ergonómicas visuales y pausas ErgoBreak',
        'Consola Mosaico WebSocket en vivo para supervisores',
        'Reportes corporativos consolidados en Excel y PDF',
        'Aislamiento multi-tenant y roles ilimitados',
      ],
      cta: 'Iniciar Prueba Gratuita',
      ruta: '/registro?plan=SAAS_SEAT_MONTHLY',
    },
    {
      tipo: 'PAY_PER_EXAM_PACKAGE',
      destacado: false,
      icono: Zap,
      nombre: 'Paquete de Evaluación / Proctoring',
      descripcion: 'Para instituciones y procesos de selección con cuestionarios externos (Google Forms).',
      precio: '$35',
      periodo: 'USD base / 50 exámenes',
      caracteristicas: [
        'Supervisión ocular y orientación de cabeza (PnP + Iris)',
        'Detección de celular y pantallas secundarias',
        'Bloqueo de atajos (Ctrl+C/V) y control de foco',
        'Modo entrevista con preguntas dinámicas',
        'Dictamen forense individual certificado SHA-256',
      ],
      cta: 'Contratar Paquete',
      ruta: '/registro?plan=PAY_PER_EXAM_PACKAGE',
    },
  ];

  return (
    <section id="planes" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Precios Transparentes SaaS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Planes flexibles para cada etapa de tu empresa
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Sin contratos forzosos. Prueba de 14 días en sandbox de facturación con comprobantes
            digitales automáticos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planes.map((plan) => {
            const Icono = plan.icono;
            return (
              <div
                key={plan.tipo}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.destacado
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 border-2 border-emerald-500 relative'
                    : 'bg-[#F8FAFC] text-slate-800 border border-slate-200/80 shadow-2xs hover:shadow'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      Más Elegido por Empresas
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.destacado ? 'bg-slate-800 text-emerald-400' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Icono className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{plan.nombre}</h3>
                      <p className={`text-xs mt-0.5 ${plan.destacado ? 'text-slate-400' : 'text-slate-500'}`}>
                        {plan.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight font-mono">{plan.precio}</span>
                      <span className={`text-xs font-medium ${plan.destacado ? 'text-slate-400' : 'text-slate-500'}`}>
                        {plan.periodo}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-200/20 text-xs sm:text-sm">
                    {plan.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={plan.destacado ? 'text-slate-200' : 'text-slate-700'}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    to={plan.ruta}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all group ${
                      plan.destacado
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
