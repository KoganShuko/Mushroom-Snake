/* eslint-disable prefer-destructuring */

import { Position, Direction } from '../types';
import { SnakePartTypes } from '../types/enums';

export class SnakePart {
  public position: Position;
  public direction: Direction;
  public lastPosition: Position | undefined;
  public width: number;
  public height: number;
  public partState: SnakePartTypes;
  public spriteRotation: number; // 0 - rotation angle 0, 1 - rotation angle 90, 2 - rotation angle 180, 3 - rotation angle 270,
  public drawImage: Function;
  public frames: Array<any>;

  constructor(
    startPosition = { x: 0, y: 0 },
    width: number,
    height: number,
    direction: Direction,
    partState: SnakePartTypes,
    spriteRotation: number,
    drawImage: Function,
    frames: Array<any>
  ) {
    this.position = startPosition;
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.partState = partState;
    this.spriteRotation = spriteRotation;
    this.drawImage = drawImage;
    this.frames = frames;
  }
  draw(): void {
    const { x, y } = this.position;
    let frame: any;
    if (this.partState === SnakePartTypes.HEAD) {
      frame = this.frames[0];
    } else if (this.partState === SnakePartTypes.STRAIGHT) {
      frame = this.frames[1];
    } else if (this.partState === SnakePartTypes.TURNING) {
      frame = this.frames[2];
    } else if (this.partState === SnakePartTypes.TAIL) {
      frame = this.frames[3];
    }
    this.drawImage(frame, x, y, this.width, this.height, this.spriteRotation);
  }
}
