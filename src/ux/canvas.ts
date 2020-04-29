import { DomConcealer } from './changeDomColor';
import { VisualSettings, CanvasSettings } from '../types';

// Canvas class in needed to communicate with canvas context
export class Canvas extends DomConcealer {
  public context: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  constructor(settings: CanvasSettings) {
    super(
      document.createElement('canvas'),
      settings.visualSettings as VisualSettings
    );
    (this.dom as HTMLCanvasElement).width = this.width = settings.width;
    (this.dom as HTMLCanvasElement).height = this.height = settings.height;
    this.context = (this.dom as HTMLCanvasElement).getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  public fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    shadowColor?: string,
    blur?: number
  ): void {
    if (this.context) {
      this.context.fillStyle = color;
      this.context.fillRect(Math.floor(x), Math.floor(y), width, height);
      if (blur && shadowColor) {
        this.context.shadowBlur = blur;
        // this.context.globalCompositeOperation = 'exclusion'
        this.context.shadowColor = shadowColor;
      }
      this.context.fill();
    }
  }

  public clearRect(x: number, y: number, width: number, height: number): void {
    if (this.context) {
      this.context.clearRect(x, y, width, height);
    }
  }

  public fillCircle(
    x: number,
    y: number,
    size: number,
    color: string,
    blur?: number
  ): void {
    if (this.context) {
      this.context.save();
      this.context.beginPath();
      const radius = size / 2;
      this.context.arc(
        Math.floor(x) + radius,
        Math.floor(y) + radius,
        radius,
        0,
        Math.PI * 2
      );
      this.context.fillStyle = color;
      if (blur) {
        this.context.shadowBlur = 10;
        this.context.shadowColor = color;
      }
      this.context.fill();
      this.context.restore();
    }
  }

  public drawImage(
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation = 0
  ): void {
    if (this.context) {
      this.context.save();
      this.context.translate(x + width / 2, y + height / 2);
      this.context.rotate((rotation * Math.PI) / 2);
      this.context.drawImage(img, -width / 2, -height / 2, width, height);
      this.context.rotate((rotation * Math.PI) / 2);
      this.context.translate(-x, -y);
      this.context.restore();
    }
  }

  public getDomElement(): HTMLCanvasElement {
    return this.dom as HTMLCanvasElement;
  }
}

// Header and Game canvas is need to have change color method that they inherit from DomConcealer
// BgCanvas change color by calling fillRect method
export class BgCanvas extends Canvas {
  private bgColor: Array<number> | undefined;
  private aimColor: Array<number> | undefined;
  private rBgStep: number | undefined;
  private gBgStep: number | undefined;
  private bBgStep: number | undefined;

  constructor(settings: CanvasSettings) {
    super(settings);
    if (settings.bgAnimationSettings) {
      this.bgColor = settings.bgAnimationSettings.bgColor;
      this.aimColor = settings.bgAnimationSettings.aimColor;
      this.rBgStep =
        (this.bgColor[0] - this.aimColor[0]) /
        settings.bgAnimationSettings.stepCount;
      this.gBgStep =
        (this.bgColor[1] - this.aimColor[1]) /
        settings.bgAnimationSettings.stepCount;
      this.bBgStep =
        (this.bgColor[2] - this.aimColor[2]) /
        settings.bgAnimationSettings.stepCount;
    }
  }
  public animateBg(toHide: boolean): void {
    if (this.rBgStep && this.gBgStep && this.bBgStep && this.bgColor) {
      this.fillRect(
        0,
        0,
        this.width,
        this.height,
        `rgb(${this.bgColor[0] - this.rBgStep},${
          this.bgColor[1] - this.gBgStep
        }, ${this.bgColor[2] - this.bBgStep})`
      );
      this.bgColor[0] -= toHide ? this.rBgStep : -this.rBgStep;
      this.bgColor[1] -= toHide ? this.gBgStep : -this.gBgStep;
      this.bgColor[2] -= toHide ? this.bBgStep : -this.bBgStep;
    }
  }
}
