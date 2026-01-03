
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
  
  // Calculate kinetic energy based on temperature
  const energyFactor = (temperature + 273.15) / 300; // Normalized around room temp

  const initParticles = useCallback(() => {
    const count = 40;
    const newParticles: Particle[] = [];
    const rows = 5;
    const cols = 8;
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    setParticles(newParticles);
  }, [width, height]);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  const update = useCallback(() => {
    setParticles(prev => prev.map(p => {
      let nx = p.x + p.vx * energyFactor;
      let ny = p.y + p.vy * energyFactor;
      let nvx = p.vx;
      let nvy = p.vy;

      // Behavior based on state
      if (state === MatterState.SOLID) {
        // Particles vibrate in place
        const originX = (p.id % 8) * (width / 8) + (width / 16);
        const originY = Math.floor(p.id / 8) * (height / 5) + (height / 10);
        nx = originX + (Math.sin(Date.now() * 0.01 * energyFactor + p.id) * 2);
        ny = originY + (Math.cos(Date.now() * 0.01 * energyFactor + p.id) * 2);
      } else {
        // Bouncing logic
        if (nx < PHYSICS.PARTICLE_RADIUS || nx > width - PHYSICS.PARTICLE_RADIUS) nvx *= -1;
        if (ny < PHYSICS.PARTICLE_RADIUS || ny > height - PHYSICS.PARTICLE_RADIUS) nvy *= -1;
        
        // Keep within bounds if state changed
        nx = Math.max(PHYSICS.PARTICLE_RADIUS, Math.min(width - PHYSICS.PARTICLE_RADIUS, nx));
        ny = Math.max(PHYSICS.PARTICLE_RADIUS, Math.min(height - PHYSICS.PARTICLE_RADIUS, ny));
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
    <svg width={width} height={height} className="rounded-lg overflow-hidden border border-slate-300 bg-white/50">
      {particles.map(p => (
        <circle 
          key={p.id} 
          cx={p.x} 
          cy={p.y} 
          r={PHYSICS.PARTICLE_RADIUS} 
          fill={COLORS[state]} 
          className="transition-colors duration-500"
        />
      ))}
    </svg>
  );
};
