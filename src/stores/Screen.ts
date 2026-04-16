import { StoreBase } from './storeShim';
import { Vector2 } from './Vector2';

export class Screen extends StoreBase {
  width = 0;
  height = 0;
  gameAreaWidth = 0;
  gameAreaHeight = 0;
  gameXOffset = 0;
  gameYOffset = 0;

  get isMobile() {
    return this.width < 768;
  }

  get screenBounds() {
    return {
      x1: 0,
      y1: 0,
      x2: this.width,
      y2: this.height
    };
  }

  get gameBoundingBox() {
    return {
      x1: this.gameXOffset,
      y1: this.gameYOffset,
      x2: this.width,
      y2: this.height
    };
  }

  isEntityInScreen(entity: any) {
    const { x1, y1, x2, y2 } = this.screenBounds;
    const { x, y } = entity.position;

    return (
      x + entity.width / 2 > x1 &&
      x - entity.width / 2 < x2 &&
      y + entity.height > y1 &&
      y - entity.height < y2
    );
  }
}

export const screen = new Screen();
