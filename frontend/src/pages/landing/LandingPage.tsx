import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Eye,
  Lock,
  Monitor,
  ShieldCheck,
  Users,
  Zap,
  FileText,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { LogoErgoCheck } from '../../components/ui/LogoErgoCheck';
import './landing.css';

/* ── Telemetría ficticia en tiempo real ───────────────────────── */
const flujoTelemetria = [
  { ts: '00:00.014', tipo: 'POSE', dato: 'neck_angle=12.3°  trunk=5.1°  RULA=2' },
  { ts: '00:00.028', tipo: 'IRIS', dato: 'pitch=-1.2°  yaw=0.8°  gaze=FRONTAL' },
  { ts: '00:00.042', tipo: 'FRAME', dato: 'processed  retained=0B  hash=discarded' },
  { ts: '00:00.057', tipo: 'POSE', dato: 'neck_angle=14.7°  trunk=6.2°  RULA=2' },
  { ts: '00:00.071', tipo: 'ALERT', dato: 'ergobreak suggested  rest=120s' },
  { ts: '00:00.085', tipo: 'IRIS', dato: 'pitch=-2.1°  yaw=1.4°  gaze=FRONTAL' },
  { ts: '00:00.099', tipo: 'FRAME', dato: 'processed  retained=0B  hash=discarded' },
  { ts: '00:00.113', tipo: 'POSE', dato: 'neck_angle=11.9°  trunk=4.8°  RULA=1' },
];

/* ── Módulos del sistema ──────────────────────────────────────── */
const modulos = [
  {
    icono: Activity,
    titulo: 'Ergonomía RULA Continua',
    descripcion: 'Inferencia biomecánica 1:1 en el navegador. Ángulos de cuello, tronco y brazos evaluados por ISO 11226 sin enviar un solo píxel al servidor.',
    etiqueta: 'Sprint 1–2',
    color: 'emerald',
  },
  {
    icono: Eye,
    titulo: 'Supervisión Ocular & Anti-Fraude',
    descripcion: 'Estimación de cabeza PnP y vector de mirada por iris. Detecta desvíos a celulares, múltiples rostros y pérdida de foco de pantalla.',
    etiqueta: 'Sprint 3',
    color: 'amber',
  },
  {
    icono: Monitor,
    titulo: 'Mosaico en Vivo vía WebSocket',
    descripcion: 'Consola de semáforo de 5 estados actualizada en tiempo real. Watchdog timer de 15s marca puestos desconectados automáticamente.',
    etiqueta: 'Sprint 4',
    color: 'sky',
  },
  {
    icono: FileText,
    titulo: 'Bitácora WORM & Reportes',
    descripcion: 'Registro encadenado con SHA-256. Dictámenes forenses en PDF y reportes ergonómicos corporativos en Excel multi-pestaña.',
    etiqueta: 'Sprint 4',
    color: 'violet',
  },
];

/* ── Hook: intersection reveal ──────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { (entry.target as HTMLElement).classList.add('is-visible'); } },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Componente: Terminal de telemetría ─────────────────────────── */
function TerminalTelemetria() {
  const [lineas, setLineas] = useState<typeof flujoTelemetria>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLineas(prev => {
        const next = [...prev, flujoTelemetria[idx % flujoTelemetria.length]];
        return next.slice(-8);
      });
      setIdx(i => i + 1);
    }, 900);
    return () => clearInterval(timer);
  }, [idx]);

  const colorTipo: Record<string, string> = {
    POSE:  'text-emerald-400',
    IRIS:  'text-sky-400',
    FRAME: 'text-slate-500',
    ALERT: 'text-amber-400',
  };

  return (
    <div className="bg-[#060d1a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 relative">
      {/* Barra de título */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <span className="w-3 h-3 rounded-full bg-rose-500 opacity-80" />
        <span className="w-3 h-3 rounded-full bg-amber-500 opacity-80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-80" />
        <span className="ml-3 text-xs font-mono text-slate-400 tracking-wide">ergocheck-ai · edge-sensor · /telemetry</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 lp-pulse" />
          <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
        </span>
      </div>

      {/* Línea de scan */}
      <div className="relative h-0.5 overflow-hidden bg-transparent">
        <div className="lp-scanline absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-24 -top-12" />
      </div>

      {/* Datos */}
      <div className="p-4 space-y-1.5 min-h-[220px] font-mono text-xs">
        {lineas.map((l, i) => (
          <div key={i} className="flex gap-3 items-baseline lp-count-up" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="text-slate-600 shrink-0 w-16">{l.ts}</span>
            <span className={`shrink-0 w-14 font-semibold ${colorTipo[l.tipo] ?? 'text-slate-400'}`}>{l.tipo}</span>
            <span className="text-slate-300 leading-relaxed">{l.dato}</span>
          </div>
        ))}
        <div className="flex gap-3 items-baseline pt-1">
          <span className="text-slate-600 w-16 shrink-0">&nbsp;</span>
          <span className="text-emerald-400">▸<span className="lp-cursor" /></span>
        </div>
      </div>

      {/* Pie con métricas */}
      <div className="border-t border-slate-800 px-4 py-3 grid grid-cols-3 gap-4 text-center">
        {[
          { v: '0 B', l: 'Video almacenado' },
          { v: '< 150B', l: 'Telemetría / frame' },
          { v: 'SHA-256', l: 'Integridad WORM' },
        ].map(({ v, l }) => (
          <div key={l}>
            <div className="text-emerald-400 font-mono font-bold text-sm">{v}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
export function LandingPage() {
  const refModulos   = useReveal() as React.RefObject<HTMLElement>;
  const refPriv      = useReveal() as React.RefObject<HTMLElement>;
  const refPlanes    = useReveal() as React.RefObject<HTMLElement>;
  const refFooter    = useReveal() as React.RefObject<HTMLElement>;

  return (
    <div className="lp-root min-h-screen flex flex-col text-slate-100">

      {/* ══ NAVBAR ════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:border-emerald-400/60 transition-colors">
              <LogoErgoCheck className="w-4 h-4" size={16} />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">ErgoCheck AI</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#modulos" className="hover:text-white transition-colors">Módulos</a>
            <a href="#privacidad" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-900/40">
              Comenzar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="lp-bg-hero lp-grid-lines flex-1">
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 lp-pulse" />
              Edge AI · ISO 11226 · Zero-Image Retention
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
              Salud postural y supervisión&nbsp;
              <span className="lp-gradient-text">sin un pixel</span> en la nube.
            </h1>

            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              ErgoCheck AI evalúa ergonomía RULA y supervisa evaluaciones en tiempo real, directo en el navegador. 
              La cámara nunca abandona el dispositivo.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
              <Link to="/registro" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-950/40 transition-all group">
                Registrar empresa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white transition-colors">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Acceso corporativo
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-slate-500">
              {['Consentimiento digital obligatorio', 'Multi-tenant aislado', 'Sin instalación'].map(g => (
                <span key={g} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <TerminalTelemetria />
        </div>

        {/* Flecha scroll-hint */}
        <div className="flex justify-center pb-10 -mt-14">
          <a href="#modulos" aria-label="Ver módulos">
            <ChevronDown className="w-6 h-6 text-slate-600 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ══ MÓDULOS ═══════════════════════════════════════════════ */}
      <section id="modulos" ref={refModulos as React.RefObject<HTMLDivElement>}
        className="bg-[#F8FAFC] py-24 lp-reveal">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <p className="text-xs font-mono text-emerald-600 mb-2">Capacidades del sistema</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-xl leading-tight">
              Cuatro módulos. Una sola plataforma.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modulos.map((m, i) => {
              const Ic = m.icono;
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                amber:   'bg-amber-50 border-amber-200 text-amber-700',
                sky:     'bg-sky-50 border-sky-200 text-sky-700',
                violet:  'bg-violet-50 border-violet-200 text-violet-700',
              };
              return (
                <div key={i} className={`lp-card bg-white rounded-2xl p-6 border border-slate-200/80 lp-reveal lp-reveal-delay-${i + 1}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[m.color]}`}>
                      <Ic className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {m.etiqueta}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{m.titulo}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ PRIVACIDAD ════════════════════════════════════════════ */}
      <section id="privacidad" ref={refPriv as React.RefObject<HTMLDivElement>}
        className="bg-slate-900 py-24 lp-reveal">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-xs font-mono text-emerald-400">Privacy by Design</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Zero-Image Retention.<br />No es un eslogan.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cada fotograma de la cámara vive exactamente el tiempo necesario para ser procesado por MediaPipe en un 
              Web Worker local. Después, desaparece. Sin almacenamiento. Sin transmisión. Sin rastro.
            </p>
            <ul className="space-y-3">
              {[
                { icon: Zap,         text: 'Inferencia en RAM volátil del cliente' },
                { icon: ShieldCheck, text: 'Telemetría numérica de <150 bytes por frame' },
                { icon: Lock,        text: 'Consentimiento legal auditable por usuario' },
                { icon: Users,       text: 'Aislamiento multi-tenant con guard criptográfico' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                  <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Comparativa visual */}
          <div className="space-y-3">
            <div className="bg-slate-800/60 border border-rose-500/20 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-mono text-rose-400 mb-3">Monitoreo Convencional</p>
              {['Video grabado y almacenado en servidores externos', 'Transmisión continua de alta bandwidth', 'Riesgo real de filtración o acceso no autorizado'].map(t => (
                <div key={t} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-rose-500 mt-0.5 shrink-0">✕</span>{t}
                </div>
              ))}
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-mono text-emerald-400 mb-3">ErgoCheck AI Edge</p>
              {['Cero bytes de video almacenados o transmitidos', 'Solo vectores numéricos angulares viajan al backend', 'Bitácora WORM verificable con SHA-256'].map(t => (
                <div key={t} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLANES ════════════════════════════════════════════════ */}
      <section id="planes" ref={refPlanes as React.RefObject<HTMLDivElement>}
        className="bg-[#F8FAFC] py-24 lp-reveal">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-14">
            <p className="text-xs font-mono text-emerald-600 mb-2">Precios SaaS</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Sin contrato. Sin sorpresas.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Plan 1 */}
            <div className="lp-card bg-slate-900 border border-emerald-500/30 rounded-2xl p-7 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-mono text-emerald-400 mb-1">Por puesto</p>
                  <p className="text-3xl font-extrabold font-mono text-white">$19 <span className="text-sm font-normal text-slate-400">/ mes</span></p>
                </div>
                <h3 className="text-base font-bold text-white">Plan Profesional</h3>
                <p className="text-xs text-slate-400">Ergonomía RULA continua para equipos en teletrabajo o presencial.</p>
                <ul className="space-y-2 pt-2 border-t border-slate-800">
                  {['Sensor biomecánico en vivo', 'Alertas y pausas ErgoBreak', 'Consola de supervisión mosaico', 'Reportes ISO 11226'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/registro?plan=SAAS_SEAT_MONTHLY" className="mt-6 block text-center py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors">
                Iniciar prueba gratuita
              </Link>
            </div>

            {/* Plan 2 */}
            <div className="lp-card bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">Base 50 exámenes</p>
                  <p className="text-3xl font-extrabold font-mono text-slate-900">$35 <span className="text-sm font-normal text-slate-400">/ paquete</span></p>
                </div>
                <h3 className="text-base font-bold text-slate-900">Paquete Proctoring</h3>
                <p className="text-xs text-slate-500">Supervisión anti-fraude para evaluaciones psicotécnicas y entrevistas.</p>
                <ul className="space-y-2 pt-2 border-t border-slate-200">
                  {['Seguimiento ocular PnP + iris', 'Detección de celulares y múltiples rostros', 'Bloqueo de atajos y portapapeles', 'Dictamen forense PDF SHA-256'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/registro?plan=PAY_PER_EXAM_PACKAGE" className="mt-6 block text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
                Contratar paquete
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer ref={refFooter as React.RefObject<HTMLDivElement>}
        className="bg-[#060d1a] border-t border-slate-800 py-10 lp-reveal">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <LogoErgoCheck className="w-4 h-4" size={14} />
            </div>
            <span className="text-sm font-bold text-white">ErgoCheck AI</span>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} ErgoCheck AI · ISO 11226 · Privacy by Design</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Acceso</Link>
            <Link to="/registro" className="hover:text-slate-300 transition-colors">Registro</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
