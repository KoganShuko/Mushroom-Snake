import { ZeroGravityAnimationOptions } from '../types';

export function zeroGravityAnimation(
  obj: HTMLElement,
  options: ZeroGravityAnimationOptions
): Function {
  obj.style.transformOrigin = '50%, 50%';
  const {
    randomOffset,
    xStep,
    xBorder,
    yStep,
    yBorder,
    sStep,
    sBorder,
    rStep,
    rBorder,
    skXStep,
    skXBorder,
    skYStep,
    skYBorder,
  } = options;
  const randomBorderMin =
    0.5 - randomOffset + (Math.random() * randomOffset) / 2;
  const randomBorderMax = 100 - randomBorderMin;
  let x = 1;
  let xRandom = Math.random() > 0.5 ? randomBorderMin : randomBorderMax;
  let y = 1;
  let yRandom = Math.random() > 0.5 ? randomBorderMin : randomBorderMax;
  let s = 1;
  let r = 0;
  let skX = 0;
  let skY = 0;
  return (): void => {
    obj.style.transform = `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg) skew(${skX}deg, ${skY}deg)`;
    x = Math.random() > xRandom ? x + xStep : x - xStep;
    if (x > xBorder.max) {
      xRandom = randomBorderMax;
    } else if (x < xBorder.min) {
      xRandom = randomBorderMin;
    }
    y = Math.random() > yRandom ? y + yStep : y - yStep;
    if (y > yBorder.max) {
      yRandom = randomBorderMax;
    } else if (y < yBorder.min) {
      yRandom = randomBorderMin;
    }
    s = Math.random() > 0.5 ? s + sStep : s - sStep;
    if (s > sBorder.max) {
      s = sBorder.max;
    } else if (s < sBorder.min) {
      s = sBorder.min;
    }
    r = Math.random() > 0.5 ? r + rStep : r - rStep;
    if (r > rBorder.max) {
      r = rBorder.max;
    } else if (r < sBorder.min) {
      r = sBorder.min;
    }
    skX = Math.random() > 0.5 ? skX + skXStep : skX - skXStep;
    if (skX > skXBorder.max) {
      skX = skXBorder.max;
    } else if (skX < skXBorder.min) {
      skX = skXBorder.min;
    }
    skY = Math.random() > 0.5 ? skY + skYStep : skY - skYStep;
    if (skY > skYBorder.max) {
      skX = skYBorder.max;
    } else if (skY < skYBorder.min) {
      skY = skYBorder.min;
    }
  };
}

export const buttonOptions: ZeroGravityAnimationOptions = {
  randomOffset: 0.2,
  xStep: 0.2,
  xBorder: {
    min: -100,
    max: 100,
  },
  yStep: 0.3,
  yBorder: {
    min: -30,
    max: 150,
  },
  sStep: 0.005,
  sBorder: {
    min: 0.8,
    max: 1.3,
  },
  rStep: 0.1,
  rBorder: {
    min: -45,
    max: 45,
  },
  skXStep: 0.1,
  skXBorder: {
    min: -5,
    max: 5,
  },
  skYStep: 0.1,
  skYBorder: {
    min: -5,
    max: 5,
  },
};

export const letterOptions: ZeroGravityAnimationOptions = {
  randomOffset: 0.25,
  xStep: 0.1,
  xBorder: {
    min: -100,
    max: 400,
  },
  yStep: 0.1,
  yBorder: {
    min: -30,
    max: 350,
  },
  sStep: 0.005,
  sBorder: {
    min: 0.8,
    max: 1.3,
  },
  rStep: 0.1,
  rBorder: {
    min: -45,
    max: 45,
  },
  skXStep: 0.1,
  skXBorder: {
    min: -5,
    max: 5,
  },
  skYStep: 0.1,
  skYBorder: {
    min: -5,
    max: 5,
  },
};
