import './index.scss';
import { wait } from '../../utils/utils';
import { SnakeSpeech } from '../../types';

const firstSpeech: SnakeSpeech = {
  0: 'WOW! What is it?',
  1: 'Is it a mushroom?',
  2: 'Ohhh, man...',
  3: 'A mushroom, again?',
};

const restSpeech: SnakeSpeech = {
  0: 'Oh no...',
  1: 'Should I eat it?',
  2: 'Ohhh, man...again!?',
};

export class SnakeCharacter {
  private dom: HTMLElement;
  private foodCreator: Function;
  private speechDom: HTMLElement;
  private speechTextContainer: HTMLElement;
  private speechOrder: number;
  private speech = firstSpeech;
  private speechList: Array<SnakeSpeech> = [firstSpeech, restSpeech];

  constructor(foodCreator: Function) {
    this.dom = document.createElement('div');
    this.dom.className = `snake-character snake-character_0`;
    this.foodCreator = foodCreator;
    this.speechDom = document.createElement('div');
    this.speechDom.className = `snake_spreeh`;
    this.speechTextContainer = document.createElement('div');
    this.speechTextContainer.className = `snake_spreeh_text`;
    this.speechDom.appendChild(this.speechTextContainer);
    this.dom.appendChild(this.speechDom);
    this.speechOrder = 0;
  }

  public getDomElement(): HTMLElement {
    return this.dom;
  }
  public async activate(): Promise<void> {
    // eslint-disable-next-line no-unused-expressions
    this.dom.offsetHeight; // to translate opacity
    this.dom.style.transform = 'translateY(0)';
    this.dom.style.opacity = '1';
    this.speechTextContainer.innerText = this.speech[this.speechOrder];
    this.speechOrder += 1;
    await wait(2000);
    this.speechTextContainer.innerText = this.speech[this.speechOrder];
    this.speechOrder += 1;
    this.foodCreator();
  }
  public hallusinationMode(): void {
    this.dom.className = `snake-character snake-character_1`;
    this.speechTextContainer.innerText = this.speech[this.speechOrder];
    this.setSpeech(1);
  }

  public setSpeech(index: number): void {
    this.speech = this.speechList[index];
  }

  public hide(): void {
    this.dom.style.transform = 'translateY(-100%)';
    this.dom.style.opacity = '0';
  }
}
