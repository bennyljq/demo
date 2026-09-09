import * as eq from '../gravity/grav-equations'

export class BackgroundStar {
  constructor(public x: number, public y: number,
    public radius: number, public color: string) {}

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath()
    context.shadowColor = this.color
    context.shadowBlur = 2
  }
}

export const celestialBodyPreset1: Array<eq.celestialBody> = [
  {
    id: 0,
    position_x: 0,
    position_y: 0,
    velocity_x: 0,
    velocity_y: 1.55,
    mass: eq.m_sun*2,
    colour: 'DodgerBlue',
    trailColour: 'PowderBlue'
  },
  {
    id: 1,
    position_x: 0.8,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -0.25,
    mass: eq.m_sun*2,
    colour: 'Firebrick',
    trailColour: 'Pink'
  },
  {
    id: 2,
    position_x: -0.95,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -1.3,
    mass: eq.m_sun*2,
    colour: 'DarkViolet',
    trailColour: 'Thistle'
  }
]
export const celestialBodyPreset2: Array<eq.celestialBody> = [
  {
    id: 0,
    position_x: 0.2,
    position_y: 0,
    velocity_x: 0,
    velocity_y: 1.55,
    mass: eq.m_sun*2,
    colour: 'DodgerBlue',
    trailColour: 'PowderBlue'
  },
  {
    id: 1,
    position_x: 1,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -0.25,
    mass: eq.m_sun*2,
    colour: 'Firebrick',
    trailColour: 'Pink'
  },
  {
    id: 2,
    position_x: -1,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -1.3,
    mass: eq.m_sun*2,
    colour: 'DarkViolet',
    trailColour: 'Thistle'
  }
]
export const celestialBodyPreset3: Array<eq.celestialBody> = [
  {
    id: 0,
    position_x: 0,
    position_y: 0,
    velocity_x: 0,
    velocity_y: 1.55,
    mass: eq.m_sun*2,
    colour: 'DodgerBlue',
    trailColour: 'PowderBlue'
  },
  {
    id: 1,
    position_x: 1,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -0.25,
    mass: eq.m_sun*2,
    colour: 'Firebrick',
    trailColour: 'Pink'
  },
  {
    id: 2,
    position_x: -1,
    position_y: 0,
    velocity_x: 0,
    velocity_y: -1.3,
    mass: eq.m_sun*2,
    colour: 'DarkViolet',
    trailColour: 'Thistle'
  }
]
export const celestialBodyPreset4: Array<eq.celestialBody> = [
  {
    id: 0,
    position_x: 0,
    position_y: -0.6,
    velocity_x: 1.2,
    velocity_y: 0,
    mass: eq.m_sun*1,
    colour: 'DodgerBlue',
    trailColour: 'PowderBlue',
    shortEdgeAU: 5,
    timestep: 3600*48
  },
  {
    id: 1,
    position_x: 0,
    position_y: -1.4,
    velocity_x: -1.2,
    velocity_y: 0,
    mass: eq.m_sun*1,
    colour: 'Firebrick',
    trailColour: 'Pink'
  },
  {
    id: 2,
    position_x: 0,
    position_y: 1,
    velocity_x: 0,
    velocity_y: 0,
    mass: eq.m_sun*1,
    colour: 'DarkViolet',
    trailColour: 'Thistle'
  }
]
export const celestialBodyPreset5: Array<eq.celestialBody> = [
  {
    id: 0,
    position_x: 0.97000436,
    position_y: 0.24308753,
    velocity_x: 0.46620368,
    velocity_y: -0.43236573,
    mass: eq.m_sun*1,
    colour: 'DodgerBlue',
    trailColour: 'PowderBlue'
  },
  {
    id: 1,
    position_x: -0.97000436,
    position_y: -0.24308753,
    velocity_x: 0.46620368,
    velocity_y: -0.43236573,
    mass: eq.m_sun*1,
    colour: 'Firebrick',
    trailColour: 'Pink'
  },
  {
    id: 2,
    position_x: 0,
    position_y: 0,
    velocity_x: -0.93240737,
    velocity_y: 0.86473146,
    mass: eq.m_sun*1,
    colour: 'DarkViolet',
    trailColour: 'Thistle'
  }
]