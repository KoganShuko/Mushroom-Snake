import { Position, GameObject } from '../types/interfaces';
import { Canvas } from '.';

// class Board controls all object that can be drawn on gameCanvas (Food/Snake)
// Food / Snake implement GameObject interface - must have draw method and position
export class Board {
  public activeObjects: Array<GameObject> = [];
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }
  // draw is called in Game.tick func
  // cals draw method in all objects that contain in activeObjects array
  public draw(timestamp?: number): void {
    const { width, height } = this.canvas;
    this.canvas.clearRect(0, 0, width, height);
    this.activeObjects.forEach((obj) => {
      obj.draw(timestamp);
    });
  }
  // put new obj to activeObjects array
  public placeObject(obj: GameObject): void {
    this.activeObjects.push(obj);
  }
  //  remove obj from activeObjects array
  public removeObject(obj: GameObject): void {
    const index = this.activeObjects.findIndex(
      (activeObject) => obj === activeObject
    );
    this.activeObjects.splice(index, 1);
  }
  // comoare obj position with all objects in activeObjects array
  public findCollision(obj: GameObject): GameObject | undefined {
    const collisionTarget = this.activeObjects.find((activeObject) => {
      const xDif = Math.abs(
        obj.position.x +
          obj.width / 2 -
          activeObject.position.x -
          activeObject.width / 2
      );
      const yDif = Math.abs(
        obj.position.y +
          obj.height / 2 -
          activeObject.position.y -
          activeObject.height / 2
      );
      const isCollision =
        xDif < activeObject.width / 1.5 && yDif < activeObject.height / 1.5;
      if (isCollision && obj !== activeObject) {
        return true;
      }
      return false;
    });
    return collisionTarget;
  }
  // generate position for new object
  public generatePosition(width: number, height: number): Position {
    const position: Position = {
      x: Math.floor(Math.random() * (this.canvas.width - width)),
      y: Math.floor(Math.random() * (this.canvas.height - height)),
    };
    return position;
  }
}
