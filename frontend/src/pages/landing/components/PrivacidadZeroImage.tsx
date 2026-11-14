import React from 'react';
import { ShieldCheck, EyeOff, HardDrive, Cpu, Check, X } from 'lucide-react';

export const PrivacidadZeroImage: React.FC = () => {
  return (
    <section id="privacidad" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Privacidad por Diseño (Privacy by Design)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contrato Estricto Zero-Image Retention
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Protegemos la intimidad de los colaboradores. La cámara web solo se procesa en la memoria
            RAM de la máquina local y se descarta de forma inmediata.
          </p>
        </div>

        {/* Comparativa: Monitoreo Invasivo vs ErgoCheck AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Tradicional Invasivo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <X className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Sistemas de Monitoreo Convencional</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Transmiten video continuo a servidores externos consumiendo ancho de banda.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Graban fotogramas y archivos de video en bases de datos con riesgo de filtración.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Invaden el espacio personal del teletrabajador sin garantías claras de privacidad.</span>
              </li>
            </ul>
          </div>

          {/* ErgoCheck AI Edge */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-md shadow-emerald-500/5 space-y-5 relative">
            <div className="absolute top-5 right-5">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Arquitectura ErgoCheck
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-700">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">ErgoCheck AI Zero-Image Edge</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>Cero video transmitido:</strong> MediaPipe se ejecuta 100% en Web Workers del navegador.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>Telemetría ultraliviana:</strong> Solo se envían vectores numéricos angulares (&lt; 150 bytes).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>Consentimiento legal auditable:</strong> Firma digital previa requerida antes de encender sensores.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
