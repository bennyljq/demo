export { G, m_sun, m_earth, au, v_earth, celestialBody, update }

const G = 6.6743 * 10**-11 // Newtonian constant of gravitation
const m_sun = 1.9885 * 10**30
const m_earth = 5.972 * 10**24
const au = 149597870700 // Astronomical unit (m)
const v_earth = 29780 // Average Earth orbital speed (m/s)
interface celestialBody {
  id: string | number
  type?: 'earth' | 'sun'
  mass: number
  position_x: number // au
  position_y: number // au
  velocity_x: number // v_e
  velocity_y: number // v_e
  colour?: string
  trailColour?: string
  shortEdgeAU?: number
  timestep?: number
}

function update(bodies: celestialBody[], timeStep: number): celestialBody[] {
  function update_acceleration(body: celestialBody): celestialBody {
    let a_x = 0
    let a_y = 0
    let otherBodies = bodies.filter(x => x.id != body.id)
    function update_body_acceleration(otherBody: celestialBody) {
      const dist_x = otherBody.position_x*au - body.position_x*au
      const dist_y = otherBody.position_y*au - body.position_y*au
      const dist = Math.sqrt(dist_x**2 + dist_y**2)
      const a = (G*otherBody.mass)/(dist**2)
      a_x += a * dist_x/dist
      a_y += a * dist_y/dist
    }
    otherBodies.forEach(update_body_acceleration);
    body.velocity_x += a_x*timeStep/v_earth
    body.velocity_y += a_y*timeStep/v_earth
    return body
  }

  function update_position(body: celestialBody): celestialBody {
    body.position_x += body.velocity_x*v_earth/au*timeStep
    body.position_y += body.velocity_y*v_earth/au*timeStep
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