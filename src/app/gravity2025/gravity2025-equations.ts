export { G, m_sun, au, celestialBody, update }

const G = 1 // Newtonian constant of gravitation
const m_sun = 1
const au = 1 // Astronomical unit (m)
interface celestialBody {
  id: string | number
  mass: number
  position_x: number // au
  position_y: number // au
  velocity_x: number // v_e
  velocity_y: number // v_e
  colour?: string
  trailColour?: string
}

function update(bodies: celestialBody[], timeStep: number): celestialBody[] {
  function update_acceleration(body: celestialBody): celestialBody {
    let a_x = 0
    let a_y = 0
    let otherBodies = bodies.filter(x => x.id != body.id)
    function update_body_acceleration(otherBody: celestialBody) {
      const dist_x = otherBody.position_x - body.position_x
      const dist_y = otherBody.position_y - body.position_y
      const dist = Math.sqrt(dist_x**2 + dist_y**2)
      const a = (G*otherBody.mass)/(dist**2)
      a_x += a * dist_x/dist
      a_y += a * dist_y/dist
    }
    otherBodies.forEach(update_body_acceleration);
    body.velocity_x += a_x*timeStep
    body.velocity_y += a_y*timeStep
    return body
  }

  function update_position(body: celestialBody): celestialBody {
    body.position_x += body.velocity_x*timeStep
    body.position_y += body.velocity_y*timeStep
    return body
  }

  bodies = bodies.map(update_acceleration)
  bodies = bodies.map(update_position)
  return bodies
}

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

export const celestialBodyPresets: Array<Array<celestialBody>> = [
  [
    {
      id: 0,
      position_x: 0,
      position_y: 0,
      velocity_x: 0,
      velocity_y: 1.55,
      mass: 2,
    },
    {
      id: 1,
      position_x: 0.8,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -0.25,
      mass: 2,
    },
    {
      id: 2,
      position_x: -0.95,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -1.3,
      mass: 2,
    }
  ],
  [
    {
      id: 0,
      position_x: 0.2,
      position_y: 0,
      velocity_x: 0,
      velocity_y: 1.55,
      mass: 2,
    },
    {
      id: 1,
      position_x: 1,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -0.25,
      mass: 2,
    },
    {
      id: 2,
      position_x: -1,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -1.3,
      mass: 2,
    }
  ],
  [
    {
      id: 0,
      position_x: 0,
      position_y: 0,
      velocity_x: 0,
      velocity_y: 1.55,
      mass: 2,
    },
    {
      id: 1,
      position_x: 1,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -0.25,
      mass: 2,
    },
    {
      id: 2,
      position_x: -1,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -1.3,
      mass: 2,
    }
  ],
  // [
  //   {
  //     id: 0,
  //     position_x: 0.97000436,
  //     position_y: 0.24308753,
  //     velocity_x: 0.46620368,
  //     velocity_y: -0.43236573,
  //     mass: 1,
  //   },
  //   {
  //     id: 1,
  //     position_x: -0.97000436,
  //     position_y: -0.24308753,
  //     velocity_x: 0.46620368,
  //     velocity_y: -0.43236573,
  //     mass: 1,
  //   },
  //   {
  //     id: 2,
  //     position_x: 0,
  //     position_y: 0,
  //     velocity_x: -0.93240737,
  //     velocity_y: 0.86473146,
  //     mass: 1,
  //   }
  // ],
  [
    {
      "id": 0,
      "position_x": 0.97000436,
      "position_y": 0.24308753,
      "velocity_x": 0.65932743,
      "velocity_y": -0.61100004,
      "mass": 2
    },
    {
      "id": 1,
      "position_x": -0.97000436,
      "position_y": -0.24308753,
      "velocity_x": 0.65932743,
      "velocity_y": -0.61100004,
      "mass": 2
    },
    {
      "id": 2,
      "position_x": 0,
      "position_y": 0,
      "velocity_x": -1.31865487,
      "velocity_y": 1.22200008,
      "mass": 2
    }
  ],
  // [
  //   {'id': 0, 'position_x': -1.0, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': 0.5656854249492381, 'mass': 2},
  //   {'id': 1, 'position_x': 1.0, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': -0.5656854249492381, 'mass': 2},
  //   {'id': 2, 'position_x': 0.0, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': 0.0, 'mass': 2}
  // ],
  [
    {'id': 0, 'position_x': -0.8, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': 1.2727922061357857, 'mass': 2},
    {'id': 1, 'position_x': 0.8, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': -1.2727922061357857, 'mass': 2},
    {'id': 2, 'position_x': 0.0, 'position_y': 0.0, 'velocity_x': 0.0, 'velocity_y': 0.0, 'mass': 2}
  ],
]