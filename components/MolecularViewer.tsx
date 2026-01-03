
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MatterState, Particle } from '../types';
import { PHYSICS, COLORS } from '../constants';

interface MolecularViewerProps {
  state: MatterState;
  temperature: number;
  width: number;
  height: number;
  volumeScale: number;
}

export const MolecularViewer: React.FC<MolecularViewerProps> = ({ 
  state, 
  temperature, 
  width, 
  height,
  volumeScale 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>();
  
  // Normalized kinetic energy
  const energyFactor = Math.max(0.1, (temperature + 273.15) / 293.15); 

  const initParticles = useCallback(() => {
    const count = state === MatterState.GAS ? 25 : 45; 
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (width - PHYSICS.PARTICLE_RADIUS * 2) + PHYSICS.PARTICLE_RADIUS,
        y: Math.random() * (height - PHYSICS.PARTICLE_RADIUS * 2) + PHYSICS.PARTICLE_RADIUS,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4
      });
    }
    setParticles(newParticles);
  }, [width, height, state]);

  useEffect(() => {
    initParticles();
  }, [state]); 

  const update = useCallback(() => {
    setParticles(prev => prev.map(p => {
      let nx = p.x + p.vx * energyFactor;
      let ny = p.y + p.vy * energyFactor;
      let nvx = p.vx;
      let nvy = p.vy;

      if (state === MatterState.SOLID) {
        const cols = 7;
        const originX = (p.id % cols) * (width / cols) + (width / (cols * 2));
        const originY = Math.floor(p.id / cols) * (height / 7) + (height / 14);
        const intensity = 1.2 * energyFactor;
        nx = originX + (Math.sin(Date.now() * 0.015 * energyFactor + p.id) * intensity);
        ny = originY + (Math.cos(Date.now() * 0.015 * energyFactor + p.id) * intensity);
      } else {
        // Collisions with moving boundaries
        if (nx < PHYSICS.PARTICLE_RADIUS) { nx = PHYSICS.PARTICLE_RADIUS; nvx *= -1; }
        if (nx > width - PHYSICS.PARTICLE_RADIUS) { nx = width - PHYSICS.PARTICLE_RADIUS; nvx *= -1; }
        if (ny < PHYSICS.PARTICLE_RADIUS) { ny = PHYSICS.PARTICLE_RADIUS; nvy *= -1; }
        if (ny > height - PHYSICS.PARTICLE_RADIUS) { ny = height - PHYSICS.PARTICLE_RADIUS; nvy *= -1; }
      }

      return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
    }));
    requestRef.current = requestAnimationFrame(update);
  }, [state, energyFactor, width, height]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return (
    <svg width={width} height={height} className="overflow-visible transition-all duration-500">
      <defs>
        <radialGradient id={`glow-${state}`}>
          <stop offset="0%" stopColor={COLORS[state]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={COLORS[state]} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Container Background */}
      <rect width={width} height={height} fill={COLORS[state]} fillOpacity="0.1" />
      
      {particles.map(p => (
        <g key={p.id}>
          {state === MatterState.GAS && energyFactor > 1.2 && (
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={PHYSICS.PARTICLE_RADIUS * 3} 
              fill={`url(#glow-${state})`}
            />
          )}
          <circle 
            cx={p.x} 
            cy={p.y} 
            r={PHYSICS.PARTICLE_RADIUS} 
            fill={COLORS[state]} 
            className="transition-colors duration-500"
            style={{ 
              filter: `brightness(${0.9 + energyFactor * 0.1})`,
              stroke: 'rgba(255,255,255,0.2)',
              strokeWidth: 1
            }}
          />
        </g>
      ))}
    </svg>
  );
};
