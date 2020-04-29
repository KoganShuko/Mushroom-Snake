import { Position } from '../types';
import { Canvas } from '../ux';

export class Dot {
  static dotList: Array<Dot> = [];
  private canvas: Canvas;
  private position: Position;
  private size: number;
  private velocity: number;
  private dotDirection: number;
  private dotDirectionCount: number;
  private possibleDotDirections: Array<Position>;
  private stepToTurn: number;
  private turnCount: number;
  private randomDirectionBorder: number;
  private stepToTurnMax: number;
  private hue: number;

  constructor(
    position: Position,
    size: number,
    dotDirectionCount: number,
    canvas: Canvas
  ) {
    this.position = position;
    this.size = size;
    this.velocity = 2.8;
    this.dotDirectionCount = dotDirectionCount;
    this.possibleDotDirections = this.generateDotDirection();
    this.dotDirection = Math.floor(Math.random() * dotDirectionCount);
    this.stepToTurnMax = 8;
    this.stepToTurn = this.stepToTurnMax;
    this.turnCount = 120;
    this.randomDirectionBorder = 0.2 + 0.6 * Math.random();
    this.hue = 100;
    this.canvas = canvas;
  }

  drawDot(): void {
    const { x, y } = this.position;
    this.canvas.fillCircle(x, y, this.size, `hsl(${this.hue}, 100%, 50%)`, 2);
  }

  moveDot(index: number): void {
    this.position.x += Math.floor(
      this.possibleDotDirections[this.dotDirection].x * this.velocity
    );
    this.position.y += Math.floor(
      this.possibleDotDirections[this.dotDirection].y * this.velocity
    );
    this.drawDot();
    this.turnCount -= 1;
    if (this.turnCount === 0) {
      Dot.killDot(index);
      return;
    }
    this.hue = (this.hue + 2) % 360;
    if (this.stepToTurn === 0) {
      this.dotDirection =
        Math.random() > this.randomDirectionBorder
          ? this.dotDirection - 1
          : this.dotDirection + 1;
      if (this.dotDirection < 0) {
        this.dotDirection = this.dotDirectionCount - 1;
      } else if (this.dotDirection >= this.dotDirectionCount) {
        this.dotDirection = 0;
      }
      this.stepToTurn = this.stepToTurnMax;
      return;
    }
    this.stepToTurn -= 1;
  }

  static killDot(index: number): void {
    Dot.dotList.splice(index, 1);
  }

  generateDotDirection(): Array<Position> {
    const directions = [];
    for (let i = 0; i < 360; i += 360 / this.dotDirectionCount) {
      const x = Math.cos((i * Math.PI) / 180);
      const y = Math.sin((i * Math.PI) / 180);
      directions.push({ x, y });
    }
    return directions;
  }
}
