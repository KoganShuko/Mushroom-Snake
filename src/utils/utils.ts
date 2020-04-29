export const wait = (time: number): Promise<void> => {
  return new Promise((res) => {
    window.setTimeout(() => {
      res();
    }, time);
  });
};

export const animate = (
  element: HTMLElement,
  className: string
): Promise<void> => {
  return new Promise((resolve) => {
    const onAnimationEnd = (): void => {
      element.classList.remove(className);
      element.removeEventListener('animationend', onAnimationEnd);
      resolve();
    };

    element.addEventListener('animationend', onAnimationEnd);
    element.classList.add(className);
  });
};
