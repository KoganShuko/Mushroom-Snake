import { VisualSettings } from '../types';

// DomConcealer is a class needed to give changeColor method
// changeColor is calling when it need to make border and background transparent
export class DomConcealer {
  public dom: HTMLElement;
  private visualSettings: VisualSettings;
  private bgOpacity: number;
  private borderOpacity: number;
  private step: number | undefined;

  constructor(dom: HTMLElement, visualSettings: VisualSettings) {
    this.visualSettings = visualSettings;
    this.dom = dom;
    this.bgOpacity = 1;
    this.borderOpacity = 1;

    if (visualSettings) {
      this.step = 1 / visualSettings.stepCount;
    }
  }
  changeColor(toHide: boolean): void {
    if (this.step) {
      const step = toHide ? this.step : -this.step;
      this.bgOpacity -= step;
      this.borderOpacity -= step;
      this.dom.style.borderColor = `rgba(${this.visualSettings.borderColor},${this.borderOpacity})`;
      this.dom.style.backgroundColor = `rgba(${this.visualSettings.bgColor},${this.bgOpacity})`;
    }
  }
}
