import { Coordinate } from "./protocols/coordinate"

export class Node {
  private GROWTH = 1.1
  private points: Coordinate[] = []
  private children: Node[] = []

  constructor (
    private x: number,
    private y: number,
    private w: number,
    private h: number
  ) {}

  containsPoint (point: Coordinate) {
    return point.x >= this.x && point.x <= this.x + this.w &&
           point.y >= this.y && point.y <= this.y + this.h
  }

  overlaps (aabb: Coordinate) {
    return aabb.x < this.x + this.w && aabb.x + aabb.w > this.x &&
           aabb.y < this.y + this.h && aabb.y + aabb.h > this.y
  }

  insert (point: Coordinate, maxPoints: number) {
    if (this.children.length != 0) {
      const col = point.x > this.x + this.w / 2
      const row = point.y > this.y + this.h / 2
      const index = Number(col) + Number(row) * 2
      this.children[index].insert(point, maxPoints * this.GROWTH)
    } else {
      this.points.push(point)
      if (this.points.length > maxPoints && this.w > 1) {
        this.split(maxPoints)
      }
    }
  }

  split (maxPoints: number) {
    const halfW = this.w / 2
    const halfH = this.h / 2
    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 2; ++x) {
        const px = this.x + x * halfW
        const py = this.y + y * halfH
        this.children.push(new Node(px, py, halfW, halfH))
      }
    }
    const oldPoints = this.points
    this.points = []
    const midX = this.x + halfW
    const midY = this.y = halfH
    for (let i = 0; i < oldPoints.length; ++i) {
      const point = oldPoints[i]
      const col = point.x > midX
      const row = point.y > midY
      const index = Number(col) + Number(row) * 2
      this.children[index].insert(point, maxPoints * this.GROWTH)
    }
  }

  some (aabb: Coordinate, test: (param: Coordinate) => number) {
    if (this.children.length != 0) {
      for (let i = 0; i < this.children.length; ++i) {
        const child = this.children[i]
        if (child.overlaps(aabb) && child.some(aabb, test)) {
          return true
        }
      }
    } else {
      for (let i = 0; i < this.points.length; ++i) {
        const point = this.points[i]
        if (this.containsPoint.call(aabb, point) && test(point)) {
          return true
        }
      }
    }
    return false
  }

  clear () {
    if (this.children.length != 0) {
      for (let i = 0; i < 4; ++i) {
        this.children[i].clear()
      }
      this.children.length = 0
    }
    this.points.length = 0
  }
}
