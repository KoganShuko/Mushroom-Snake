import { SnakePart } from './snakePart';
import {
  Position,
  Direction,
  GameKey,
  SnakeSpriteState,
  SnakePartTypes,
} from '../types';

export class Snake extends SnakePart {
  public segments: Array<SnakePart>;
  public width: number;
  public height: number;
  public drawImage: Function;
  public frames: Array<any>;
  private moveDistance: number;
  private isKeyPressed: boolean; // prevent snake 280 deg turning by fast key press

  constructor(
    position: Position,
    width: number,
    height: number,
    drawImage: Function,
    frames: Array<any>
  ) {
    super(
      position,
      width,
      height,
      Direction.NONE,
      SnakePartTypes.HEAD,
      Direction.RIGHT,
      drawImage,
      frames
    );
    this.moveDistance = 15;
    this.segments = [];
    this.segments[0] = this;
    this.width = width;
    this.height = height;
    this.drawImage = drawImage;
    this.frames = frames;
    this.isKeyPressed = false;
  }

  public move = (boardWidth: number, boardHeight: number): void => {
    // Move each segment and calculate new directions, sprites and rotations
    if (this.direction === Direction.NONE) {
      return;
    }
    let lastPosition = { ...this.position };
    this.segments.forEach((segment, i) => {
      const startPosition = { ...segment.position };
      if (i === 0) {
        segment.spriteRotation = +this.direction;
        switch (this.direction) {
          case Direction.UP:
            segment.position.y -= this.moveDistance;
            break;
          case Direction.RIGHT:
            segment.position.x += this.moveDistance;
            break;
          case Direction.DOWN:
            segment.position.y += this.moveDistance;
            break;
          case Direction.LEFT:
            segment.position.x -= this.moveDistance;
            break;
        }
      }
      if (i !== 0) {
        let direction;
        if (
          (segment.position.x - lastPosition.x > 0 &&
            Math.abs(segment.position.x - lastPosition.x) === segment.width) ||
          (segment.position.x - lastPosition.x < 0 &&
            Math.abs(segment.position.x - lastPosition.x) > segment.width)
        ) {
          direction = Direction.LEFT;
        } else if (
          (segment.position.x - lastPosition.x < 0 &&
            Math.abs(segment.position.x - lastPosition.x) === segment.width) ||
          (segment.position.x - lastPosition.x > 0 &&
            segment.position.x - lastPosition.x > segment.width)
        ) {
          direction = Direction.RIGHT;
        } else if (
          (segment.position.y - lastPosition.y > 0 &&
            Math.abs(segment.position.y - lastPosition.y) === segment.height) ||
          (segment.position.y - lastPosition.y < 0 &&
            Math.abs(segment.position.y - lastPosition.y) > segment.height)
        ) {
          direction = Direction.UP;
        } else if (
          (segment.position.y - lastPosition.y < 0 &&
            Math.abs(segment.position.y - lastPosition.y) === segment.height) ||
          (segment.position.y - lastPosition.y > 0 &&
            Math.abs(segment.position.y - lastPosition.y) > segment.height)
        ) {
          direction = Direction.DOWN;
        }
        segment.position = lastPosition;
        if (direction !== undefined) {
          segment.direction = direction;
          const { rotation, type } = Snake.getSpriteState(
            direction,
            this.segments,
            i
          );
          segment.spriteRotation = rotation;
          segment.partState = type;
        }
      }
      if (segment.position.x + segment.width > boardWidth) {
        segment.position.x = 0;
      } else if (segment.position.y + segment.height > boardHeight) {
        segment.position.y = 0;
      } else if (segment.position.x < 0) {
        segment.position.x = boardWidth - segment.width;
      } else if (segment.position.y < 0) {
        segment.position.y = boardHeight - segment.height;
      }
      lastPosition = startPosition;
      segment.lastPosition = startPosition;
    });
    this.isKeyPressed = false;
  };

  public reset(): void {
    this.position = { x: 0, y: 0 };
    this.direction = Direction.NONE;
    this.segments = [this.segments[0]];
    this.spriteRotation = 1;
  }

  public updateSnakeDirection(
    isHallucinationStart: boolean,
    key: number
  ): void {
    // this method is activates after keypress
    if (this.isKeyPressed) return;
    this.isKeyPressed = true;
    // in hallucination mode snake can randomly change direction to opposite
    const hallucinationDirectionChange = (direction: Direction): boolean => {
      if (isHallucinationStart) {
        if (Math.random() > 0.8) {
          if (Math.random() > 0.5) {
            this.changeDirection();
          } else {
            // eslint-disable-next-line no-lonely-if
            if (direction === Direction.UP) {
              this.direction = Direction.DOWN;
            } else if (direction === Direction.DOWN) {
              this.direction = Direction.UP;
            } else if (direction === Direction.LEFT) {
              this.direction = Direction.RIGHT;
            } else if (direction === Direction.RIGHT) {
              this.direction = Direction.LEFT;
            }
          }
          return true;
        }
      }
      return false;
    };

    const handleKeyPress = (direction: Direction): void => {
      const isChange = hallucinationDirectionChange(direction);
      if (isChange) return;
      this.direction = direction;
    };
    switch (key) {
      case GameKey.UP:
        if (
          this.direction !== Direction.DOWN &&
          this.direction !== Direction.UP
        ) {
          handleKeyPress(Direction.UP);
        }
        break;
      case GameKey.RIGHT:
        if (
          this.direction !== Direction.LEFT &&
          this.direction !== Direction.RIGHT
        ) {
          handleKeyPress(Direction.RIGHT);
        }
        break;
      case GameKey.DOWN:
        if (
          this.direction !== Direction.UP &&
          this.direction !== Direction.DOWN
        ) {
          handleKeyPress(Direction.DOWN);
        }
        break;
      case GameKey.LEFT:
        if (
          this.direction !== Direction.RIGHT &&
          this.direction !== Direction.LEFT
        ) {
          handleKeyPress(Direction.LEFT);
        }
        break;
    }
  }

  private changeDirection(): void {
    const snakePartPositions = this.segments.map((segment) => segment.position);
    snakePartPositions.reverse();
    this.segments.forEach((segment, i) => {
      segment.position = snakePartPositions[i];
    });

    const tailDirection = this.segments[this.segments.length - 1]
      .direction as Direction;
    if (tailDirection === Direction.UP) {
      this.direction = Direction.DOWN;
    } else if (tailDirection === Direction.DOWN) {
      this.direction = Direction.UP;
    } else if (tailDirection === Direction.LEFT) {
      this.direction = Direction.RIGHT;
    } else if (tailDirection === Direction.RIGHT) {
      this.direction = Direction.LEFT;
    }
  }

  static getSpriteState(
    direction: Direction,
    segments: SnakePart[],
    index: number
  ): SnakeSpriteState {
    let rotation = 0;
    let type = SnakePartTypes.TURNING;
    const nextDirection = segments[index - 1].direction;
    if (direction === nextDirection) {
      type = SnakePartTypes.STRAIGHT;
      rotation = +nextDirection;
    } else if (nextDirection === Direction.UP) {
      if (direction === Direction.RIGHT) {
        rotation = 3;
      } else if (direction === Direction.LEFT) {
        rotation = 0;
      }
    } else if (nextDirection === Direction.RIGHT) {
      if (direction === Direction.UP) {
        rotation = 1;
      } else if (direction === Direction.DOWN) {
        rotation = 0;
      }
    } else if (nextDirection === Direction.DOWN) {
      if (direction === Direction.RIGHT) {
        rotation = 2;
      } else if (direction === Direction.LEFT) {
        rotation = 1;
      }
    } else if (nextDirection === Direction.LEFT) {
      if (direction === Direction.UP) {
        rotation = 2;
      } else if (direction === Direction.DOWN) {
        rotation = 3;
      }
    }
    if (index === segments.length - 1) {
      type = SnakePartTypes.TAIL;
      rotation = nextDirection;
    }
    return { rotation, type };
  }

  public grow(): SnakePart {
    const lastSegment = this.segments[this.segments.length - 1];
    const { lastPosition, spriteRotation, direction } = lastSegment;

    const newSnakePart = new SnakePart(
      lastPosition,
      this.width,
      this.height,
      direction as Direction,
      SnakePartTypes.TAIL,
      spriteRotation,
      this.drawImage,
      this.frames
    );
    this.segments.push(newSnakePart);
    return newSnakePart;
  }
}
