import { DomConcealer } from '../changeDomColor';
import { VisualSettings } from '../../types';
import './index.scss';

const headerHTML = `
  <span class="header__title">
    <span class="header__title_letter header__title_s">S</span>
    <span class="header__title_letter header__title_n">n</span>
    <span class="header__title_letter header__title_a">a</span>
    <span class="header__title_letter header__title_k">k</span>
    <span class="header__title_letter header__title_e">e</span>
  </span>
  <div class="score">0</div>
  <button class="header__button header__button_reset">reset</button>
  <button class="header__button header__button_pause">pause</button>
  <button class="header__button header__button_start">start</button>
`;

export class Header extends DomConcealer {
  private scoreDOM: HTMLElement | undefined;

  constructor(visualSettings: VisualSettings) {
    super(document.createElement('header'), visualSettings);
    this.dom.classList.add('header');
    this.dom.insertAdjacentHTML('afterbegin', headerHTML);
  }

  getDomElement(): HTMLElement {
    return this.dom;
  }

  appendTo(container: HTMLElement): void {
    container.appendChild(this.dom);
    this.scoreDOM = document.querySelector('.score') as HTMLElement;
  }

  setScore(score: number): void {
    if (this.scoreDOM) {
      this.scoreDOM.innerHTML = `${score}`;
    }
  }
}
