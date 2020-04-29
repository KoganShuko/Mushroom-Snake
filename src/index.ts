/* eslint-disable prefer-destructuring */
import { Canvas, BgCanvas, Board, Header, PopupCreator } from './ux';
import {
  Snake,
  Food,
  Mushroom,
  SnakePart,
  FoodFactory,
  images,
} from './objects';
import { SnakeCharacter } from './ux/snakeCharacter';
import {
  KeyController,
  ButtonClickController,
  SpriteLoader,
} from './controller';
import { toggleHallucinationMode } from './visuals';
import { cfg } from './settings';
import { NestedTickFunctions, TickFunctions, GameKey } from './types';
import './index.scss';

class Game {
  public static bgCanvas: Canvas; // canvas for bg animations
  public static gameCanvas: Canvas; // canvas for snake
  public static snake: Snake;
  public static tickFunctions: TickFunctions; // object of functions that will be looped in raf. Can contain nested func obj
  public static isHallucinationStart = false; // true after eating a mushroom - need to change behavior of the snake
  public static snakeCharacter: SnakeCharacter; // big snake pic appearing before mushroom
  private static rootStyles: CSSStyleDeclaration; // need to boud snake position and bg animation
  private static score = 0;
  private static startScoreBorder = cfg.scoreBorder; // need when reset a game
  private static scoreBorder = cfg.scoreBorder; // on score > scoreBorder snake starts to move faster
  private static scoreBorderStep = cfg.scoreBorderStep; // indicates how fast movement speed will increase
  private static snakeFPS = cfg.snakeFPS; // snake speed depends on its fps
  private static snakeFPSStep = cfg.snakeFPSStep;
  private static isMushroomOnBoard = false; // true when mushroom is on board. Need to prevet 2 mushroom at the same time
  private static isPause = false; // true when pause button is clicked. Need to stop tickFunctions loop
  private static isDead = false; // true when snake is dead

  static async init(): Promise<void> {
    // init header
    const root = document.getElementById('root') as HTMLElement;
    const header = new Header({
      bgColor: cfg.headerBGcolor,
      borderColor: cfg.headerBorderColor,
      stepCount: 100,
    });
    header.appendTo(root);
    // init game canvas
    const gameCanvas = new Canvas({
      width: cfg.canvasWidth,
      height: cfg.canvasHeight,
      visualSettings: {
        bgColor: cfg.gameCanvasColor,
        borderColor: cfg.gameCanvasBorderColor,
        stepCount: 100,
      },
    });
    const gameCanvasDOM = gameCanvas.getDomElement();
    root.appendChild(gameCanvasDOM);
    gameCanvasDOM.classList.add('game-canvas');
    Game.gameCanvas = gameCanvas;

    // init background canvas
    const bgCanvas = new BgCanvas({
      width: window.innerWidth,
      height: window.innerHeight,
      bgAnimationSettings: {
        bgColor: cfg.bgColor,
        aimColor: cfg.hallucinationBGColor,
        stepCount: 100,
      },
    });
    const bgCanvasDOM = bgCanvas.getDomElement();
    document.body.appendChild(bgCanvasDOM);
    bgCanvasDOM.classList.add('background-canvas');
    Game.bgCanvas = bgCanvas;

    const resize = (): void => {
      bgCanvasDOM.width = Game.bgCanvas.width = window.innerWidth;
      bgCanvasDOM.height = Game.bgCanvas.height = window.innerHeight;
      bgCanvas.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
        `rgb(${cfg.bgColor.toString()})`
      );
      Game.rootStyles = window.getComputedStyle(root) as CSSStyleDeclaration;
      root.style.width = `${cfg.canvasWidth}px`;
      root.style.height = `${cfg.canvasHeight + cfg.headerHeight}px`;
      let scaleHeight = 1;
      if (window.innerWidth < cfg.canvasWidth + cfg.gameCanvasMargin) {
        root.style.width = `${window.innerWidth - cfg.gameCanvasMargin}px`;
        scaleHeight =
          (window.innerWidth - cfg.gameCanvasMargin) / cfg.canvasWidth;
        root.style.height = `${
          cfg.canvasHeight * scaleHeight + cfg.headerHeight + cfg.margingTop
        }px`;
      }
      if (
        window.innerHeight <
        cfg.canvasHeight * scaleHeight +
          cfg.headerHeight +
          cfg.margingTop +
          cfg.margingBottom
      ) {
        const scale =
          window.innerHeight /
          (cfg.canvasHeight +
            cfg.headerHeight +
            cfg.margingTop +
            cfg.margingBottom);
        root.style.height = `${
          window.innerHeight - cfg.margingBottom - cfg.margingTop
        }px`;
        root.style.width = `${cfg.canvasWidth * scale}px`;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const popupCreator = new PopupCreator();
    // start popup with arrow pic
    const startPopup = popupCreator.createPopup('start');
    if (startPopup) {
      startPopup.appendTo(root);
      startPopup.activatePopup();
    }

    // LoadSprites
    // all pics are separeted not in a single spritesheet
    const spriteLoader = new SpriteLoader(images);
    await spriteLoader.load();

    const snake = new Snake(
      { x: 0, y: 0 },
      cfg.snakePartSize,
      cfg.snakePartSize,
      gameCanvas.drawImage.bind(gameCanvas),
      spriteLoader.images.snake.frames
    );
    Game.snake = snake;
    const board = new Board(Game.gameCanvas);
    board.placeObject(snake);

    // mushroomEffect will be called after a mushroom will be eaten
    function mushroomEffect(): void {
      Game.tickFunctions.hallucination = toggleHallucinationMode(
        [header, Game.gameCanvas, Game.bgCanvas],
        true,
        100,
        Game.tickFunctions,
        Game.bgCanvas,
        () => {
          Game.tickFunctions.hallucination = toggleHallucinationMode(
            [header, Game.gameCanvas, Game.bgCanvas],
            false,
            100,
            Game.tickFunctions
          );
          Game.snakeCharacter.hide();
          Game.isHallucinationStart = false;
        }
      );
    }
    // food instatce is created if there us no food and after eating only one food on board except mushroom
    const foodCreator = new FoodFactory();
    function createFood(isMushroom?: boolean): void {
      let type: string;
      if (isMushroom) {
        type = 'mushroom';
      } else {
        const randomIndex = Math.floor(
          Math.random() * FoodFactory.normalTypes.length
        );
        type = FoodFactory.normalTypes[randomIndex];
      }
      const { frames, width, height } = spriteLoader.images[type];
      const position = board.generatePosition(width, height);
      const scale = Math.random() * 0.3 + 0.85;
      const food = foodCreator.createFood(
        type,
        gameCanvas.drawImage.bind(gameCanvas),
        frames,
        width * scale,
        height * scale,
        position,
        isMushroom ? mushroomEffect : undefined
      );
      board.placeObject(food);
    }
    createFood(false);

    function resetGame(): void {
      KeyController.key = null;
      board.activeObjects = [board.activeObjects[0]];
      Game.score = 0;
      header.setScore(0);
      Game.isPause = false;
      Game.isMushroomOnBoard = false;
      Game.isHallucinationStart = false;
      Game.scoreBorder = Game.startScoreBorder;
      Game.snakeFPS = cfg.snakeFPS;
      if (Game.snakeCharacter) {
        Game.snakeCharacter.setSpeech(0);
      }
      createFood(false);
    }
    // activate Header buttons
    ButtonClickController.activateHandler('.header__button_reset', () => {
      resetGame();
      snake.reset();
    });
    ButtonClickController.activateHandler('.header__button_pause', () => {
      Game.isPause = true;
    });
    ButtonClickController.activateHandler('.header__button_start', () => {
      Game.isPause = false;
    });

    function keyPressCallback(key: number): void {
      if (Game.isDead) return;
      if (!GameKey[key]) return;
      Game.isPause = false;
      snake.updateSnakeDirection(Game.isHallucinationStart, key);
    }
    // activate snake Controller
    document.addEventListener('keydown', (event) =>
      KeyController.onKeyUp(event, keyPressCallback)
    );

    // snake collision handler
    // snake can run into food / mushroom or snakePart
    function handleCollision(): void {
      const collisionTarget = board.findCollision(snake);
      if (!collisionTarget) return;
      // run into SnakePart
      if (collisionTarget instanceof SnakePart) {
        Game.isDead = true;
        if (Game.isHallucinationStart) {
          Game.tickFunctions.hallucination = toggleHallucinationMode(
            [header, Game.gameCanvas, Game.bgCanvas],
            false,
            100,
            Game.tickFunctions
          );
        }
        if (Game.snakeCharacter) {
          Game.snakeCharacter.hide();
        }
        snake.reset();
        resetGame();

        const endPopup = popupCreator.createPopup('end');
        if (endPopup) {
          endPopup.appendTo(root);
          endPopup.activatePopup(() => {
            Game.isDead = false;
          });
        }
        // run into Food
      } else if (collisionTarget instanceof Food) {
        // run into mushroom
        if (collisionTarget instanceof Mushroom) {
          Game.snakeCharacter.hallusinationMode();
          collisionTarget.startHallucination();
          Game.isMushroomOnBoard = false;
          Game.isHallucinationStart = true;
        } else {
          createFood(false);
        }
        Game.score += collisionTarget.value;
        header.setScore(Game.score);
        board.removeObject(collisionTarget);
        const newSnakePart = snake.grow();
        board.placeObject(newSnakePart);
        // snake speed increasing and creation SnakeCharacter with a mushroom
        if (Game.score >= Game.scoreBorder) {
          if (!Game.isMushroomOnBoard && !Game.isHallucinationStart) {
            Game.snakeCharacter = new SnakeCharacter(() => createFood(true));
            root.appendChild(Game.snakeCharacter.getDomElement());
            Game.snakeCharacter.activate();
            Game.isMushroomOnBoard = true;
          }
          if (Game.snakeFPS < 60) {
            Game.snakeFPS += Game.snakeFPSStep;
          } else if (Game.snakeFPS > 60) {
            Game.snakeFPS = 60;
          }
          Game.scoreBorder += Game.scoreBorderStep;
        }
      }
    }

    // functions that will be calling in raf
    // placed in obj for simplify removal
    Game.tickFunctions = {
      snakeMove: (): void => {
        handleCollision();
        Game.snake.move(Game.gameCanvas.width, Game.gameCanvas.height);
      },
      boardDraw: board.draw.bind(board),
    };
  }

  static start(): void {
    Game.tick(Game.tickFunctions);
  }

  static tick(functions: TickFunctions): void {
    let then = Date.now();
    const functionCaller = (time: number): void => {
      const fpsInterval = 1000 / Game.snakeFPS;
      if (Game.isPause) {
        window.requestAnimationFrame(functionCaller);
        return;
      }

      const now = Date.now();
      const elapsed = now - then;

      const keys = Object.keys(functions);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (
          Object.prototype.toString.call(functions[key]) === '[object Object]'
        ) {
          const nestedKeys = Object.keys(functions[key]);
          const nestedObj = functions[key] as NestedTickFunctions;
          for (let j = 0; j < nestedKeys.length; j += 1) {
            const nestedKey = nestedKeys[j];
            if (nestedKey === 'clock') {
              nestedObj[nestedKey](Game.isDead);
            } else if (nestedKey === 'bgCanvasAnimation') {
              nestedObj[nestedKey](
                Game.bgCanvas,
                Game.snake,
                Game.rootStyles,
                Game.gameCanvas.width
              );
            } else {
              nestedObj[nestedKey](time);
            }
          }
        } else {
          const func = functions[key] as Function;
          // decrease fps to slow a snake
          if (key === 'snakeMove') {
            if (elapsed > fpsInterval) {
              then = now - (elapsed % fpsInterval);
              func(time);
            }
          } else {
            func(time);
          }
        }
      }
      window.requestAnimationFrame(functionCaller);
    };
    window.requestAnimationFrame(functionCaller);
  }
}

Game.init().then(() => {
  Game.start();
});
