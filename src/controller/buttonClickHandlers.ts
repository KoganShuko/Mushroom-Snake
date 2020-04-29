export class ButtonClickController {
  static activateHandler(buttonSelector: string, handler: EventListener): void {
    const button = document.querySelector(buttonSelector);
    if (button) {
      button.addEventListener('click', handler);
    }
  }
}
