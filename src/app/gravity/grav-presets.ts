import * as eq from './grav-equations'
export { presets }

let presets = [
  {
    name: "Binary Star System",
    timeStep: 3600*6,
    ticks: 6000,
    state: [
      {
        id: "sun-1",
        type: 'sun',
        position_x: 0.2*eq.au,
        position_y: 0,
        velocity_x: 0,
        velocity_y: 1.25*eq.v_earth,
        mass: eq.m_sun
      },
      {
        id: "sun-2",
        type: 'sun',
        position_x: -0.2*eq.au,
        position_y: 0,
        velocity_x: 0,
        velocity_y: -1.25*eq.v_earth,
        mass: eq.m_sun
      },
      {
        id: "earth-1",
        type: 'earth',
        position_x: eq.au,
        position_y: 0,
        velocity_x: 0,
        velocity_y: -Math.sqrt(2)*eq.v_earth,
        mass: eq.m_earth
      },
      {
        id: "earth-2",
        type: 'earth',
        position_x: -eq.au,
        position_y: eq.au,
        velocity_x: 0.7*eq.v_earth,
        velocity_y: 0.52*eq.v_earth,
        mass: eq.m_earth
      },
      {
        id: "earth-3",
        type: 'earth',
        position_x: -eq.au,
        position_y: 0.5*eq.au,
        velocity_x: 1*eq.v_earth,
        velocity_y: 1*eq.v_earth,
        mass: eq.m_earth
      },
      {
        id: "earth-4",
        type: 'earth',
        position_x: -1.1*eq.au,
        position_y: 0,
        velocity_x: 0,
        velocity_y: 1.3*eq.v_earth,
        mass: eq.m_earth
      },
      {
        id: "earth-5",
        type: 'earth',
        position_x: -0.66*eq.au,
        position_y: -1*eq.au,
        velocity_x: 0,
        velocity_y: 0*eq.v_earth,
        mass: eq.m_earth
      },
    ]
  },
  {
    name: "Sun-Earth System",
    timeStep: 3600*6,
    ticks: 1461,
    state: [
      {
        id: "sun-1",
        type: 'sun',
        position_x: 0,
        position_y: 0,
        velocity_x: 0,
        velocity_y: 0,
        mass: eq.m_sun
      },
      {
        id: "earth-1",
        type: 'earth',
        position_x: 1.0167*eq.au,
        position_y: 0,
        velocity_x: 0,
        velocity_y: -29290,
        mass: eq.m_earth
      }
    ]
  },
]