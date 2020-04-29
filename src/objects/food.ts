import { Position } from '../types';

export class Food {
  public frames: Array<HTMLImageElement>;
  public width: number;
  public height: number;
  public position: Position;
  public value: number;
  private bgPosition: number;
  private animationTime: number;
  private drawImage: Function;

  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position
  ) {
    this.frames = frames;
    this.width = width;
    this.height = height;
    this.position = position;
    this.bgPosition = 0;
    this.drawImage = drawImage;
    this.value = 1;
    this.animationTime = 0;
  }

  public draw(timestamp: number): void {
    if (!this.animationTime) {
      this.animationTime = timestamp;
    }
    if (timestamp && this.animationTime) {
      const progress = timestamp - this.animationTime;
      if (progress / 200 > 1) {
        this.bgPosition += 1;
        this.animationTime = timestamp;
        if (this.bgPosition >= Object.keys(this.frames).length) {
          this.bgPosition = 0;
        }
      }
    }
    if (this.position) {
      const { x, y } = this.position;
      this.drawImage(
        this.frames[this.bgPosition],
        x,
        y,
        this.width,
        this.height
      );
    }
  }
}

class Knight extends Food {
  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position
  ) {
    super(drawImage, frames, width, height, position);
    this.value = 1;
  }
}

class Zombie extends Food {
  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position
  ) {
    super(drawImage, frames, width, height, position);
    this.value = 2;
  }
}

class Wizzard extends Food {
  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position
  ) {
    super(drawImage, frames, width, height, position);
    this.value = 3;
  }
}

class Demon extends Food {
  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position
  ) {
    super(drawImage, frames, width, height, position);
    this.value = 5;
  }
}

export class Mushroom extends Food {
  public effect: Function;
  constructor(
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position,
    effect: Function
  ) {
    super(drawImage, frames, width, height, position);
    this.effect = effect;
  }
  startHallucination(): void {
    this.effect();
    this.value = 100;
  }
}

export class FoodFactory {
  static list: any = {
    knight: Knight,
    wizzard: Wizzard,
    zombie: Zombie,
    demon: Demon,
    mushroom: Mushroom,
  };
  public static normalTypes = ['demon', 'knight', 'wizzard', 'zombie'];
  public static specialTypes = ['mashroom'];

  // eslint-disable-next-line class-methods-use-this
  createFood(
    type: string,
    drawImage: Function,
    frames: Array<HTMLImageElement>,
    width: number,
    height: number,
    position: Position,
    effect?: Function
  ): Food {
    const FoodCreator = FoodFactory.list[type];
    return new FoodCreator(drawImage, frames, width, height, position, effect);
  }
}
