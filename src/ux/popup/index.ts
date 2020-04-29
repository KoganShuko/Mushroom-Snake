import { animate } from '../../utils/utils';
import './index.scss';

abstract class Popup {
  public dom: HTMLElement;

  constructor() {
    this.dom = document.createElement('div');
    this.dom.classList.add('popup');
  }

  getDomElement(): HTMLElement {
    return this.dom;
  }

  async hide(): Promise<void> {
    await animate(this.dom, 'popup-hide');
    this.dom.style.display = 'none';
  }
  async show(): Promise<void> {
    await animate(this.dom, 'popup-show');
    this.dom.style.opacity = '1';
  }

  appendTo(container: HTMLElement): void {
    container.appendChild(this.dom);
  }

  async activatePopup(this: Popup, cb?: Function): Promise<void> {
    const hidePopup = (): void => {
      this.hide();
      document.removeEventListener('keydown', hidePopup);
    };
    if (cb) {
      cb();
    }
    document.addEventListener('keydown', hidePopup);
  }
}

class StartPopup extends Popup {
  constructor() {
    super();
    this.dom.classList.add('popup_start');
  }
}

const endPopupHTML = `
  <div class="popup_text-container">
    You are dead!
  </div>
`;

class EndPopup extends Popup {
  constructor() {
    super();
    this.dom.classList.add('popup_end');
    this.dom.innerHTML = endPopupHTML;
  }
  async activatePopup(this: Popup, cb?: Function): Promise<void> {
    await this.show();
    super.activatePopup(cb);
  }
}

export class PopupCreator {
  private Start = StartPopup;
  private End = EndPopup;

  createPopup(type: string): Popup | undefined {
    switch (type) {
      case 'start':
        return new this.Start();
      case 'end':
        return new this.End();
    }
    return undefined;
  }
}
