import React, { useState, useEffect } from 'react';
import { playCountdownBeep, playStartChime } from '../utils/audio';

interface CountdownScreenProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ onComplete, onCancel }) => {
  // Steps: 'prest' (800ms) -> '3' (1000ms) -> '2' (1000ms) -> '1' (1000ms) -> 'hasi' (700ms)
  const [step, setStep] = useState<'prest' | '3' | '2' | '1' | 'hasi'>('prest');

  useEffect(() => {
    const t0 = setTimeout(() => {
      setStep('3');
      playCountdownBeep(700, 0.12);
    }, 900);

    const t1 = setTimeout(() => {
      setStep('2');
      playCountdownBeep(700, 0.12);
    }, 1900);

    const t2 = setTimeout(() => {
      setStep('1');
      playCountdownBeep(700, 0.12);
    }, 2900);

    const t3 = setTimeout(() => {
      setStep('hasi');
      playStartChime();
    }, 3900);

    const t4 = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Stroke dash calculation for circular progress ring
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const progressRatio = step === 'prest' ? 0.1 : step === '3' ? 0.35 : step === '2' ? 0.65 : step === '1' ? 0.95 : 1.0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D12] text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(6,78,59,0.15)_0%,transparent_50%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full mx-auto text-center">
        {/* Top Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mintzakats · Eguneko Erronka
          </span>
        </div>

        {/* Central Dynamic Dial */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center my-2">
          {/* Animated SVG Outer Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              className="text-neutral-800/60"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active Glowing Progress Ring */}
            <circle
              cx="80"
              cy="80"
              r={circleRadius}
              stroke="url(#emeraldGradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Glowing Centerpiece */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {step === 'prest' && (
              <div className="animate-in zoom-in-75 duration-300 flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  Prest?
                </span>
                <span className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
                  20 galdera
                </span>
              </div>
            )}

            {(step === '3' || step === '2' || step === '1') && (
              <div
                key={step}
                className="animate-in zoom-in-50 duration-200 flex flex-col items-center justify-center"
              >
                <span className="text-8xl sm:text-9xl font-black tracking-tighter text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]">
                  {step}
                </span>
              </div>
            )}

            {step === 'hasi' && (
              <div className="animate-in zoom-in-90 duration-150 flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.9)] uppercase">
                  HASI!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Subtitle Guidance */}
        <div className="mt-6 min-h-[40px] flex items-center justify-center">
          {step === 'prest' && (
            <p className="text-xs font-bold text-neutral-400 animate-pulse">
              Denbora kronometratuko da. Zorte on!
            </p>
          )}
          {(step === '3' || step === '2' || step === '1') && (
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Galderak kargatzen...
            </p>
          )}
          {step === 'hasi' && (
            <p className="text-sm font-black text-emerald-300">
              Aurrera, erantzun denak!
            </p>
          )}
        </div>

        {/* Optional Cancel button in early phase */}
        {step === 'prest' && onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 text-xs font-bold text-neutral-500 hover:text-neutral-300 underline cursor-pointer transition-colors"
          >
            Utzi eta itzuli
          </button>
        )}
      </div>
    </div>
  );
};
