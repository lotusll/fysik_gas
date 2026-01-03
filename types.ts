
export enum MatterState {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAS = 'GAS'
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface SimulationState {
  temperature: number; // In Celsius
  activeState: MatterState;
}

export interface ExplanationResponse {
  summary: string;
  molecularDetail: string;
  comparison: string;
}
