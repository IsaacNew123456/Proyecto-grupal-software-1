import React from 'react';
import { CabeceraLanding } from './components/CabeceraLanding';
import { HeroLanding } from './components/HeroLanding';
import { ModulosLanding } from './components/ModulosLanding';
import { PrivacidadZeroImage } from './components/PrivacidadZeroImage';
import { PlanesLanding } from './components/PlanesLanding';
import { PieLanding } from './components/PieLanding';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      <CabeceraLanding />
      <main className="flex-1">
        <HeroLanding />
        <ModulosLanding />
        <PrivacidadZeroImage />
        <PlanesLanding />
      </main>
      <PieLanding />
    </div>
  );
};

export default LandingPage;
