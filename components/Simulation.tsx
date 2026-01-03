
import React from 'react';
import { MatterState } from '../types';
import { PHYSICS, COLORS } from '../constants';
import { MolecularViewer } from './MolecularViewer';

interface SimulationProps {
  temperature: number;
}

export const Simulation: React.FC<SimulationProps> = ({ temperature }) => {
  const getVolumeScale = (state: MatterState) => {
    const kelvin = temperature + 273.15;
    const baseKelvin = 273.15; // 0 Celsius
    const deltaT = temperature;

    switch (state) {
      case MatterState.SOLID:
        return 1 + (deltaT * PHYSICS.COEFF_SOLID * 0.01);
      case MatterState.LIQUID:
        return 1 + (deltaT * PHYSICS.COEFF_LIQUID * 0.01);
      case MatterState.GAS:
        return kelvin / baseKelvin;
      default:
        return 1;
    }
  };

  const states = [
    { 
      type: MatterState.SOLID, 
      label: 'Fast form', 
      sub: 'Järn', 
      color: COLORS.SOLID,
      desc: 'Molekylerna vibrerar i en fast struktur.'
    },
    { 
      type: MatterState.LIQUID, 
      label: 'Vätska', 
      sub: 'Vatten', 
      color: COLORS.LIQUID,
      desc: 'Molekylerna rör sig nära varandra.' 
    },
    { 
      type: MatterState.GAS, 
      label: 'Gas', 
      sub: 'Luft', 
      color: COLORS.GAS,
      desc: 'Molekylerna rör sig helt oberoende.' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-2">
      {states.map((s) => {
        const scale = getVolumeScale(s.type);
        const displayWidth = PHYSICS.CONTAINER_WIDTH;
        const displayHeight = PHYSICS.CONTAINER_HEIGHT * scale;
        
        return (
          <div key={s.type} className="group flex flex-col items-center bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                {s.sub}
              </span>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{s.label}</h3>
            </div>
            
            {/* Chamber Container - Reduced fixed height to remove dead space */}
            <div className="relative h-[320px] w-full flex items-end justify-center rounded-2xl overflow-hidden bg-slate-50 border-x-2 border-b-2 border-slate-200">
              
              {/* Foreground Measurement UI (z-20) */}
              <div className="absolute inset-0 z-20 pointer-events-none p-4 flex flex-col justify-end">
                {/* 0°C Reference Line */}
                <div 
                  className="absolute left-0 right-0 border-t border-slate-400 border-dashed" 
                  style={{ bottom: `${PHYSICS.CONTAINER_HEIGHT}px` }}
                >
                  <span className="absolute left-2 -top-4 text-[9px] font-bold text-slate-400 uppercase">
                    Nivå vid 0°C
                  </span>
                </div>

                {/* Scale Ticks */}
                <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-between py-10 opacity-30">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-full border-b border-slate-900"></div>
                  ))}
                </div>
              </div>

              {/* The Molecular Container - The "Substance" */}
              <div className="relative z-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                {/* Top Lid/Piston Visual */}
                <div 
                  className="absolute -top-1 left-0 right-0 h-1 z-30 opacity-50 transition-colors"
                  style={{ backgroundColor: s.color }}
                ></div>

                <MolecularViewer 
                  state={s.type} 
                  temperature={temperature} 
                  width={displayWidth} 
                  height={displayHeight}
                  volumeScale={scale}
                />
                
                {/* Floating Volume Indicator (Always on top of substance) */}
                <div className="absolute -top-8 left-0 right-0 flex justify-center z-30">
                  <span className="bg-slate-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg backdrop-blur-sm">
                    {((scale - 1) * 100).toFixed(1)}% Expansion
                  </span>
                </div>
              </div>

              {/* Reflection Over Substance */}
              <div className="absolute inset-0 z-25 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
            </div>
            
            <div className="mt-5 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }}></div>
                <span className="text-sm font-bold text-slate-700">Relativ Volym: {(scale * 100).toFixed(1)}%</span>
              </div>
              <p className="text-xs text-center text-slate-500 leading-relaxed font-medium px-2">
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
