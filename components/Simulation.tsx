
import React, { useMemo } from 'react';
import { MatterState } from '../types';
import { PHYSICS, COLORS } from '../constants';
import { MolecularViewer } from './MolecularViewer';

interface SimulationProps {
  temperature: number;
}

export const Simulation: React.FC<SimulationProps> = ({ temperature }) => {
  // Logic for visual expansion
  // We normalize expansion based on Kelvin but exaggerate for the demo
  const getVolumeScale = (state: MatterState) => {
    const kelvin = temperature + 273.15;
    const baseKelvin = 273.15; // 0 Celsius
    const deltaT = temperature; // change from 0C

    switch (state) {
      case MatterState.SOLID:
        return 1 + (deltaT * PHYSICS.COEFF_SOLID * 0.01);
      case MatterState.LIQUID:
        return 1 + (deltaT * PHYSICS.COEFF_LIQUID * 0.01);
      case MatterState.GAS:
        // Charles's Law approximation: V1/T1 = V2/T2
        return kelvin / baseKelvin;
      default:
        return 1;
    }
  };

  const states = [
    { type: MatterState.SOLID, label: 'Fast form (Järn)', color: COLORS.SOLID },
    { type: MatterState.LIQUID, label: 'Vätska (Vatten)', color: COLORS.LIQUID },
    { type: MatterState.GAS, label: 'Gas (Luft)', color: COLORS.GAS },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto p-4">
      {states.map((s) => {
        const scale = getVolumeScale(s.type);
        const displayWidth = PHYSICS.CONTAINER_WIDTH;
        const displayHeight = PHYSICS.CONTAINER_HEIGHT * scale;
        
        return (
          <div key={s.type} className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-slate-700">{s.label}</h3>
            
            <div className="relative h-[400px] flex items-end justify-center w-full bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-200">
              {/* Reference indicator */}
              <div 
                className="absolute bottom-6 border-b-2 border-slate-300 w-[220px] pointer-events-none" 
                style={{ height: `${PHYSICS.CONTAINER_HEIGHT}px` }}
              >
                <span className="absolute -left-16 bottom-0 text-xs text-slate-400">Volym vid 0°C</span>
              </div>

              <div className="relative transition-all duration-300 ease-out">
                <MolecularViewer 
                  state={s.type} 
                  temperature={temperature} 
                  width={displayWidth} 
                  height={displayHeight}
                  volumeScale={scale}
                />
                
                {/* Volume Label */}
                <div className="absolute -top-8 left-0 right-0 text-center">
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-mono shadow-sm border border-slate-200">
                    Volym: {(scale * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-center text-slate-500 max-w-[200px]">
              {s.type === MatterState.GAS 
                ? "Gasmolekyler rör sig fritt och utvidgas kraftigt när de får mer energi."
                : s.type === MatterState.LIQUID 
                ? "Molekylerna glider förbi varandra men hålls nära av krafter."
                : "Molekylerna sitter fast i ett mönster och vibrerar bara."}
            </p>
          </div>
        );
      })}
    </div>
  );
};
