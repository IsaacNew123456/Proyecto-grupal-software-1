import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HeartPulse,
  Eye,
  FileCheck2,
  Clock,
  Lock,
  Smile,
  Laptop,
  HelpCircle,
  Award,
  Zap,
} from 'lucide-react';
import { LogoErgoCheck } from '../../components/ui/LogoErgoCheck';
import './landing.css';

/* ── Hook: Intersection Reveal para animaciones fluidas al hacer scroll ── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Preguntas Frecuentes (FAQ) ── */
const preguntasFrecuentes = [
  {
    pregunta: '¿Mis colaboradores necesitan instalar algún programa o extensión?',
    respuesta:
      'No. ErgoCheck AI funciona 100% en el navegador web (Google Chrome, Edge, Safari, Brave). Solo abren el enlace proporcionado por su empresa y el sistema se activa al instante sin permisos de administrador.',
  },
  {
    pregunta: '¿La cámara graba o guarda fotos de las personas?',
    respuesta:
      'Absolutamente no. La privacidad es nuestro pilar fundamental. La Inteligencia Artificial analiza la alineación postural en la memoria temporal de la computadora y descarta la imagen de inmediato. Jamás se sube video a ningún servidor.',
  },
  {
    pregunta: '¿Cómo ayuda a la empresa a reducir costos laborales?',
    respuesta:
      'Las malas posturas frente a la computadora son la causa #1 de licencias por lumbalgia y síndrome de túnel carpiano. ErgoCheck AI previene lesiones tempranas, fomenta micropausas activas y genera reportes para cumplimiento de Salud y Seguridad en el Trabajo (SST).',
  },
  {
    pregunta: '¿Cómo funciona la supervisión para exámenes y entrevistas?',
    respuesta:
      'El sistema detecta si el postulante mantiene su atención en la prueba, si hay distractores en el entorno o personas adicionales, garantizando evaluaciones transparentes sin invadir la privacidad.',
  },
];

/* ── Componente: Showcase Interactivo del Producto para Clientes ── */
function ShowcaseProducto() {
  const [modo, setModo] = useState<'ergonomia' | 'proctoring'>('ergonomia');
  const [indicadorActivo, setIndicadorActivo] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/30 to-sky-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />

      {/* Contenedor principal de la tarjeta */}
      <div className="relative bg-[#0F172A]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Barra superior con selector de vista (Tabs interactivos) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-medium text-slate-300">
              Vista previa interactiva
            </span>
          </div>

          {/* Switch interactivo amigable para el cliente */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setModo('ergonomia')}
              className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 ${
                modo === 'ergonomia'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              Salud Postural
            </button>
            <button
              type="button"
              onClick={() => setModo('proctoring')}
              className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 ${
                modo === 'proctoring'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Supervisión
            </button>
          </div>
        </div>

        {/* Área visual central con la imagen renderizada y elementos interactivos */}
        <div className="relative h-[290px] sm:h-[320px] overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Imagen ilustrativa generada de alta calidad */}
          <img
            src="/assets/ergocheck_hero.jpg"
            alt="ErgoCheck AI Análisis Postural"
            className="w-full h-full object-cover object-center opacity-85 transition-all duration-700 hover:scale-105"
            onError={(e) => {
              // Fallback estético si la imagen tarda en cargar
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Gradiente oscuro sobre la imagen para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30 pointer-events-none" />

          {/* Badge en vivo flotante superior */}
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg lp-float">
            <span className="w-2 h-2 rounded-full bg-emerald-400 lp-indicator-live" />
            <span className="font-semibold tracking-wide">
              {modo === 'ergonomia' ? 'Análisis Ergonómico Activo' : 'Supervisión en Curso'}
            </span>
          </div>

          {/* Tarjeta flotante superior derecha: Puntuación de Bienestar */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white p-3 rounded-xl shadow-xl lp-float-reverse hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {modo === 'ergonomia' ? '98%' : '100%'}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {modo === 'ergonomia' ? 'Puntaje Ergonómico' : 'Atención y Foco'}
                </p>
                <p className="text-xs font-bold text-emerald-400">
                  {modo === 'ergonomia' ? 'Excelente Postura' : 'Postulante Enfocado'}
                </p>
              </div>
            </div>
          </div>

          {/* Alerta inteligente flotante en la parte inferior */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-lg">
            {modo === 'ergonomia' ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Smile className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Hábito Saludable Recomendado
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                      En 20 min
                    </span>
                  </p>
                  <p className="text-xs text-slate-300 truncate">
                    Tómate 2 minutos para relajar hombros y mirar al horizonte.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Entorno de Evaluación Verificado
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium">
                      Seguro
                    </span>
                  </p>
                  <p className="text-xs text-slate-300 truncate">
                    Sin distractores externos. Foco visual 100% en la prueba.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel inferior interactivo con indicadores que reaccionan al mouse */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
          {(modo === 'ergonomia'
            ? [
                { label: 'Alineación de Cuello', val: 'Correcta (12°)', color: 'text-emerald-400' },
                { label: 'Espalda y Tronco', val: 'Ergonómica', color: 'text-emerald-400' },
                { label: 'Pausa Sugerida', val: 'En 25 min', color: 'text-sky-400' },
              ]
            : [
                { label: 'Mirada en Pantalla', val: 'Constante', color: 'text-emerald-400' },
                { label: 'Dispositivos Externos', val: '0 Detectados', color: 'text-emerald-400' },
                { label: 'Privacidad', val: '100% Protegida', color: 'text-emerald-400' },
              ]
          ).map((item, i) => (
            <div
              key={item.label}
              onMouseEnter={() => setIndicadorActivo(i)}
              onMouseLeave={() => setIndicadorActivo(null)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                indicadorActivo === i
                  ? 'bg-slate-800 border-emerald-500/60 scale-105 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <p className={`text-xs font-bold ${item.color}`}>{item.val}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Componente Principal de Landing Page ── */
export function LandingPage() {
  const refBeneficios = useReveal() as React.RefObject<HTMLElement>;
  const refPrivacidad = useReveal() as React.RefObject<HTMLElement>;
  const refPlanes = useReveal() as React.RefObject<HTMLElement>;
  const refFAQ = useReveal() as React.RefObject<HTMLElement>;
  const [faqAbierto, setFaqAbierto] = useState<number | null>(0);

  return (
    <div className="lp-root min-h-screen flex flex-col bg-[#0B1120] text-slate-100">

      {/* ══ 1. BARRA DE NAVEGACIÓN ══════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-400 transition-all">
              <LogoErgoCheck className="w-5 h-5" size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">ErgoCheck AI</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Bienestar & Seguridad
              </span>
            </div>
          </Link>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#beneficios" className="hover:text-emerald-400 transition-colors">
              Beneficios
            </a>
            <a href="#privacidad" className="hover:text-emerald-400 transition-colors">
              Privacidad Total
            </a>
            <a href="#planes" className="hover:text-emerald-400 transition-colors">
              Planes
            </a>
            <a href="#preguntas" className="hover:text-emerald-400 transition-colors">
              Preguntas Frecuentes
            </a>
          </div>

          {/* Acciones principales */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-800/80 transition-all"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="lp-btn-primary inline-flex items-center gap-2 text-xs font-bold text-slate-950 px-4 py-2.5 rounded-xl transition-all"
            >
              Comenzar Gratis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ 2. HERO PRINCIPAL CENTRADO EN EL CLIENTE ══════════════ */}
      <section className="lp-bg-hero lp-grid-lines flex-1 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          
          {/* Lado Izquierdo: Propuesta de Valor clara y amigable */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Badge de confianza */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Inteligencia Artificial para Bienestar Laboral y Evaluación
            </div>

            {/* Título Principal Atractivo */}
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.12] tracking-tight text-white">
              Cuida la postura de tu equipo y supervisa evaluaciones{' '}
              <span className="lp-gradient-text">con total privacidad.</span>
            </h1>

            {/* Subtítulo enfocado en soluciones para empresas */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              ErgoCheck AI previene dolores musculares y fatiga en tus colaboradores mediante corrección ergonómica amigable, y garantiza evaluaciones en línea confiables. 
              <strong className="text-white font-semibold"> Todo directo en el navegador, sin grabar ni guardar video.</strong>
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/registro"
                className="lp-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 group"
              >
                Probar gratis en mi empresa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#beneficios"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500 hover:text-white transition-all hover:bg-slate-800/60"
              >
                Ver cómo funciona
              </a>
            </div>

            {/* Puntos de confianza sin tecnicismos */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Cero instalación de software
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                100% confidencial y privado
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Listo en 2 minutos
              </span>
            </div>
          </div>

          {/* Lado Derecho: Showcase visual e interactivo (reemplazo del código técnico) */}
          <div className="flex justify-center items-center">
            <ShowcaseProducto />
          </div>
        </div>

        {/* Flecha indicadora de scroll */}
        <div className="flex justify-center pb-8 -mt-6">
          <a
            href="#beneficios"
            aria-label="Ver beneficios"
            className="p-2 rounded-full text-slate-500 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* ══ 3. CINTA DE IMPACTO Y MÉTRICAS CLAVE ══════════════════ */}
      <section className="bg-slate-900 border-y border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">-40%</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Dolores de cuello y espalda</p>
            <p className="text-[11px] text-slate-400">Hábitos ergonómicos guiados</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-sky-400">0 Bytes</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Video en la nube</p>
            <p className="text-[11px] text-slate-400">Procesamiento local 100% privado</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">1 Clic</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Acceso inmediato</p>
            <p className="text-[11px] text-slate-400">Sin descargas ni configuraciones</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Cumplimiento SST</p>
            <p className="text-[11px] text-slate-400">Reportes automáticos en PDF y Excel</p>
          </div>
        </div>
      </section>

      {/* ══ 4. BENEFICIOS PARA LA EMPRESA Y COLABORADORES ═════════ */}
      <section
        id="beneficios"
        ref={refBeneficios as React.RefObject<HTMLDivElement>}
        className="bg-[#F8FAFC] text-slate-900 py-24 lp-reveal"
      >
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Todo en una sola solución
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Diseñado para el bienestar de las personas y la tranquilidad de la empresa.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Herramientas inteligentes y amigables que cuidan la salud ocupacional sin generar fricción en el día a día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Beneficio 1 */}
            <div className="lp-feature-card bg-white rounded-2xl p-7 shadow-sm">
              <div className="lp-icon-box w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Corrección Postural en Tiempo Real
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                El sistema detecta cuando el colaborador se encorva o acerca demasiado la vista a la pantalla, mostrando avisos sutiles y amigables para corregir la postura antes de que cause dolor.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="lp-feature-card bg-white rounded-2xl p-7 shadow-sm">
              <div className="lp-icon-box w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pausas Activas Programadas (ErgoBreak)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recomendaciones automáticas de estiramiento y descanso visual de 2 minutos. Ayuda a recargar energía, reduce la fatiga visual y eleva la concentración en jornadas extensas.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="lp-feature-card bg-white rounded-2xl p-7 shadow-sm">
              <div className="lp-icon-box w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Supervisión Confiable y Respetuosa
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Para procesos de selección, evaluaciones y exámenes. Detecta desvíos de atención o presencia de dispositivos externos con total transparencia y sin guardar imágenes del postulante.
              </p>
            </div>

            {/* Beneficio 4 */}
            <div className="lp-feature-card bg-white rounded-2xl p-7 shadow-sm">
              <div className="lp-icon-box w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Reportes y Certificados en 1 Clic
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Genera al instante informes ergonómicos en Excel y dictámenes oficiales en PDF para Recursos Humanos y comités de Seguridad y Salud en el Trabajo (SST).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. PRIVACIDAD TOTAL EXPLICADA SIMPLE ══════════════════ */}
      <section
        id="privacidad"
        ref={refPrivacidad as React.RefObject<HTMLDivElement>}
        className="bg-[#0B1120] py-24 lp-reveal border-t border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Privacidad y Seguridad
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Tu cámara jamás graba ni sube videos a la nube.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Sabemos que la privacidad de tu equipo es sagrada. Por eso, diseñamos ErgoCheck AI bajo la arquitectura 
              <strong className="text-emerald-400 font-semibold"> Cero Retención de Imágenes</strong>:
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  title: 'Procesamiento 100% en el dispositivo',
                  desc: 'La IA analiza la postura en la memoria RAM de tu computadora. La imagen nunca viaja por internet.',
                },
                {
                  title: 'Cero grabaciones o capturas guardadas',
                  desc: 'Una vez calculado el ángulo postural en milisegundos, el cuadro visual se borra de inmediato.',
                },
                {
                  title: 'Consentimiento informado previo',
                  desc: 'Cada usuario acepta expresamente el uso antes de activar la cámara, cumpliendo todas las normativas legales.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparativa visual amigable */}
          <div className="space-y-4">
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <span>✕</span> El riesgo con otros sistemas
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  Graban y guardan horas continuas de video en servidores remotos.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  Riesgo permanente de filtraciones de la intimidad del hogar o trabajo.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  Consumo excesivo de ancho de banda y conexiones lentas.
                </li>
              </ul>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 space-y-3 lp-glow-pulse">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span>✓</span> Con ErgoCheck AI
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <strong className="text-white">Cero video grabado:</strong> La cámara solo calcula ángulos y se desecha al instante.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Garantía total de privacidad para colaboradores en teletrabajo o presencial.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Conexión ultra rápida y ultraligera que no satura el internet.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. PLANES Y PRECIOS TRANSPARENTES ═════════════════════ */}
      <section
        id="planes"
        ref={refPlanes as React.RefObject<HTMLDivElement>}
        className="bg-[#F8FAFC] py-24 text-slate-900 lp-reveal"
      >
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Inversión clara
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Planes simples. Sin contratos forzosos.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Elige la modalidad que mejor se adapte al tamaño de tu empresa o a tus jornadas de evaluación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan 1: Salud Postural y Ergonomía */}
            <div className="lp-interactive-card bg-slate-900 text-white border-2 border-emerald-500/50 rounded-2xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                Más Popular
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Salud Postural Continua
                  </p>
                  <p className="text-4xl font-black text-white">
                    $19 <span className="text-sm font-normal text-slate-400">/ puesto al mes</span>
                  </p>
                </div>

                <h3 className="text-lg font-bold text-white">Plan Salud Ocupacional</h3>
                <p className="text-xs text-slate-300">
                  Ideal para equipos de oficina, teletrabajo y call centers que buscan cuidar la salud de sus trabajadores.
                </p>

                <ul className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Sensor ergonómico inteligente en vivo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Alertas suaves de mala postura y pausas activas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Panel de control general para Recursos Humanos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Reportes ergonómicos exportables en Excel
                  </li>
                </ul>
              </div>

              <Link
                to="/registro?plan=SAAS_SEAT_MONTHLY"
                className="lp-btn-primary mt-8 block text-center py-3 rounded-xl font-bold text-sm text-slate-950 transition-all"
              >
                Comenzar prueba gratuita
              </Link>
            </div>

            {/* Plan 2: Supervisión y Evaluaciones */}
            <div className="lp-interactive-card bg-white text-slate-900 border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:border-slate-400 transition-all">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Supervisión Anti-Fraude
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    $35 <span className="text-sm font-normal text-slate-500">/ paquete 50 pruebas</span>
                  </p>
                </div>

                <h3 className="text-lg font-bold text-slate-900">Paquete Evaluaciones</h3>
                <p className="text-xs text-slate-600">
                  Perfecto para reclutamiento, entrevistas laborales y exámenes académicos o de certificación.
                </p>

                <ul className="space-y-3 pt-3 border-t border-slate-200 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Monitoreo de atención y foco en pantalla
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Detección de dispositivos o personas adicionales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Protección contra atajos y copiado indebido
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Certificado de autenticidad en PDF oficial
                  </li>
                </ul>
              </div>

              <Link
                to="/registro?plan=PAY_PER_EXAM_PACKAGE"
                className="mt-8 block text-center py-3 rounded-xl font-bold text-sm border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
              >
                Contratar paquete
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. PREGUNTAS FRECUENTES (FAQ INTERACTIVO) ═════════════ */}
      <section
        id="preguntas"
        ref={refFAQ as React.RefObject<HTMLDivElement>}
        className="bg-[#0B1120] py-24 lp-reveal border-t border-slate-800"
      >
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Resolvemos tus dudas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-400 text-sm">
              Todo lo que necesitas saber antes de implementar ErgoCheck AI en tu equipo.
            </p>
          </div>

          <div className="space-y-4">
            {preguntasFrecuentes.map((item, index) => {
              const estaAbierto = faqAbierto === index;
              return (
                <div
                  key={item.pregunta}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => setFaqAbierto(estaAbierto ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-100 hover:text-emerald-400 transition-colors"
                  >
                    <span>{item.pregunta}</span>
                    <span className="text-slate-400 shrink-0">
                      {estaAbierto ? (
                        <ChevronUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </span>
                  </button>

                  {estaAbierto && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {item.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 8. LLAMADA A LA ACCIÓN FINAL (CTA BANNER) ══════════════ */}
      <section className="bg-gradient-to-b from-[#0B1120] to-[#060D1A] py-20 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 text-center space-y-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Empieza a cuidar la salud de tu equipo hoy mismo.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Únete a las organizaciones que priorizan el bienestar ergonómico y las evaluaciones seguras sin invadir la privacidad.
          </p>
          <div className="pt-2">
            <Link
              to="/registro"
              className="lp-btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-base text-slate-950 shadow-xl"
            >
              Crear cuenta gratis para mi empresa
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 9. FOOTER ═════════════════════════════════════════════ */}
      <footer className="bg-[#050A14] border-t border-slate-800/80 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <LogoErgoCheck className="w-4 h-4" size={14} />
            </div>
            <span className="font-bold text-sm text-slate-200">ErgoCheck AI</span>
          </div>
          <p>© {new Date().getFullYear()} ErgoCheck AI. Todos los derechos reservados. Privacidad por diseño.</p>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-slate-300 transition-colors">
              Acceso Clientes
            </Link>
            <Link to="/registro" className="hover:text-slate-300 transition-colors">
              Registro Empresas
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
