import { Images } from '../types';

export class SpriteLoader {
  images: Images;

  constructor(images: Images) {
    this.images = images;
  }

  async load(): Promise<void> {
    function onloadHandler(
      img: HTMLImageElement,
      promiseArr: Array<Promise<void>>
    ): void {
      promiseArr.push(
        new Promise((res) => {
          // eslint-disable-next-line no-param-reassign
          img.onload = (): void => {
            res();
          };
        })
      );
    }
    const promises: Array<Promise<void>> = [];

    const keys = Object.keys(this.images);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      this.images[key].frames = this.images[key].frames.map((frame) => {
        const image = new Image();
        image.src = frame;
        onloadHandler(image, promises);
        return image;
      });
    }
    await Promise.all(promises);
  }
}
