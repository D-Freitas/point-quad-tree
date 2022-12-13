import { Coordinate } from "./protocols/coordinate"
import { Node } from './node'

export class PointQuadTree {
  private node: Node
  private maxPoints: number

  constructor (x: number, y: number, w: number, h: number, maxPoints: number) {
    this.node = new Node(x, y, w, h)
    this.maxPoints = maxPoints
  }

  clear () {
    this.node.clear()
  }

  insert (point: Coordinate) {
    if (!this.node.containsPoint(point)) return
    this.node.insert(point, this.maxPoints)
  }

  some (aabb: Coordinate, test: (param: Coordinate) => number) {
    this.node.some(aabb, test)
  }
}
