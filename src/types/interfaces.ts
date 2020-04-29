import { Direction, SnakePartTypes } from '.';
import { DomConcealer } from '../ux/changeDomColor';
import { Canvas } from '../ux';

export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  position: Position;
  draw(time?: number): void;
  width: number;
  height: number;
  lastDirection?: Direction;
}

export type Images = {
  [key: string]: {
    frames: Array<any>;
    width: number;
    height: number;
  };
};

export interface ZeroGravityAnimationOptions {
  randomOffset: number;
  xStep: number;
  xBorder: {
    min: number;
    max: number;
  };
  yStep: number;
  yBorder: {
    min: number;
    max: number;
  };
  sStep: number;
  sBorder: {
    min: number;
    max: number;
  };
  rStep: number;
  rBorder: {
    min: number;
    max: number;
  };
  skXStep: number;
  skXBorder: {
    min: number;
    max: number;
  };
  skYStep: number;
  skYBorder: {
    min: number;
    max: number;
  };
}

export interface NestedTickFunctions {
  [key: string]: Function;
}

export interface TickFunctions {
  [key: string]: Function | NestedTickFunctions | Promise<void>;
}

export interface SnakeSpeech {
  [key: number]: string;
}

export interface SnakeSpriteState {
  rotation: number;
  type: SnakePartTypes;
}

export interface VisualSettings {
  bgColor: string;
  borderColor: string;
  stepCount: number;
}

export interface BgAnimationSettings {
  bgColor: Array<number>;
  aimColor: Array<number>;
  stepCount: number;
}

export interface ChangeColorSettings {
  elList: Array<DomConcealer | Canvas>;
  toHide: boolean;
}

export interface CanvasSettings {
  width: number;
  height: number;
  visualSettings?: VisualSettings;
  bgAnimationSettings?: BgAnimationSettings;
}
