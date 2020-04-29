/* eslint-disable @typescript-eslint/no-use-before-define */
import { Canvas, BgCanvas } from '../ux';
import { cfg } from '../settings';
import {
  zeroGravityAnimation,
  buttonOptions,
  letterOptions,
} from './zeroGravityAnimation';
import { Dot } from './dot';
import { Direction, NestedTickFunctions, TickFunctions } from '../types';
import { drawClock } from './clock';
import { DomConcealer } from '../ux/changeDomColor';
import { Snake } from '../objects';

export const toggleHallucinationMode = (
  elList: Array<DomConcealer | BgCanvas>,
  toHide: boolean,
  stepCount: number,
  tickFunctions: TickFunctions,
  bgCanvas?: Canvas,
  clockCb?: Function
): Function => {
  return (): void => {
    elList.forEach((el) => {
      if (el instanceof BgCanvas) {
        el.animateBg(toHide);
      } else if (el instanceof DomConcealer) {
        el.changeColor(toHide);
      }
    });
    if (stepCount === 0 && toHide && bgCanvas && clockCb) {
      onStartHallucinationAnimation(bgCanvas, clockCb, tickFunctions);
    } else if (stepCount === 100 && !toHide) {
      onEndHallucinationAnimation();
    } else if (stepCount === 0 && !toHide) {
      delete tickFunctions.hallucination;
    }
    stepCount -= 1;
  };
};

const animatedDOMObjects: Array<HTMLElement> = [];

function onStartHallucinationAnimation(
  bgCanvas: Canvas,
  clockCb: Function,
  tickFunctions: TickFunctions
): void {
  document.body.classList.add('body-hallucination');

  const resetButton = document.querySelector(
    '.header__button_reset'
  ) as HTMLElement;
  const pauseButton = document.querySelector(
    '.header__button_pause'
  ) as HTMLElement;
  const startButton = document.querySelector(
    '.header__button_start'
  ) as HTMLElement;
  const hallucinationTickObject = {} as NestedTickFunctions;
  hallucinationTickObject.clock = drawClock(
    { x: 200, y: 200 },
    30000,
    bgCanvas.context,
    clockCb
  );
  hallucinationTickObject.resetButton = zeroGravityAnimation(
    resetButton,
    buttonOptions
  );
  hallucinationTickObject.pauseButton = zeroGravityAnimation(
    pauseButton,
    buttonOptions
  );
  hallucinationTickObject.startButton = zeroGravityAnimation(
    startButton,
    buttonOptions
  );

  const score = document.querySelector('.score') as HTMLElement;
  hallucinationTickObject.score = zeroGravityAnimation(score, letterOptions);

  animatedDOMObjects.push(resetButton, pauseButton, startButton, score);

  ['s', 'n', 'a', 'k', 'e'].forEach((letter) => {
    const letterDOM = document.querySelector(
      `.header__title_${letter}`
    ) as HTMLElement;
    if (letterDOM) {
      animatedDOMObjects.push(letterDOM);
      hallucinationTickObject[letter] = zeroGravityAnimation(
        letterDOM,
        letterOptions
      );
    }
  });

  hallucinationTickObject.bgCanvasAnimation = bgCanvasAnimation;
  tickFunctions.hallucination = hallucinationTickObject;
}

function onEndHallucinationAnimation(): void {
  Dot.dotList = [];
  animatedDOMObjects.forEach((obj) => {
    obj.style.transition = 'transform 2s';
    obj.style.transform = 'translate(0,0) scale(1) skewX(0) skewY(0) rotate(0)';
  });
}

function bgCanvasAnimation(
  canvas: Canvas,
  snake: Snake,
  rootStyles: CSSStyleDeclaration,
  gameCanvasWidth: number
): void {
  const rootScale = window.parseInt(rootStyles.width) / gameCanvasWidth;
  const hallucinationBGColor = cfg.hallucinationBGColor.toString();
  canvas.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
    'rgba(0,0,0, 0.05)',
    `rgba(${hallucinationBGColor}, 1)`,
    1
  );
  Dot.dotList.forEach((dot, i) => {
    dot.moveDot(i);
  });
  if (Math.random() > 0.92 && Dot.dotList.length < 100) {
    const { segments } = snake;
    const randomSegmentInd = Math.floor(Math.random() * segments.length);
    const snakePosition = segments[randomSegmentInd].position;
    const dotSize = 3;

    const x =
      (snakePosition.x + snake.width / 2 - dotSize / 2) * rootScale +
      window.parseInt(rootStyles.marginLeft);
    const y =
      (snakePosition.y + snake.height / 2 - dotSize / 2) * rootScale +
      cfg.headerHeight +
      window.parseInt(rootStyles.marginTop);
    const randomDirCount = Math.floor(Math.random() * 9) + 3;
    const direction = segments[randomSegmentInd].direction as Direction;
    if (direction !== Direction.NONE) {
      for (let i = 0; i <= randomDirCount; i += 1) {
        const dot = new Dot({ x, y }, dotSize, randomDirCount, canvas);
        Dot.dotList.push(dot);
      }
    }
  }
}
