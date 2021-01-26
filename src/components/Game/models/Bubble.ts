import { v4 as uuidv4 } from 'uuid';
import BaseBubble from '../interfaces/BaseBubble';
import { HitAngleFactor } from '../enums/HitAngleFactor';
import {
  BUBBLE_DIAMETER,
} from '../constants';
import colorizer from '../modules/colorizer';

export default class Bubble {
  public readonly id = uuidv4();
  public top: number;
  public left: number;
  public angle: number;
  public diameter: number;
  public lastHitBrik = '';
  public lastAngleFactor = HitAngleFactor.NONE;
  public readonly background = colorizer();

  constructor({
    top,
    left,
    angle,
  }: BaseBubble, diameter = BUBBLE_DIAMETER) {
    this.top = top;
    this.left = left;
    this.angle = angle;
    this.diameter = diameter;
  }

  public moveBubble(xMovement: number, yMovement: number) {
    this.left += xMovement;
    this.top -= yMovement;
  }

  public setLastBrik(brikId: string) {
    this.lastHitBrik = brikId;
  }

  public isSameBrik(brikId: string) {
    return this.lastHitBrik === brikId;
  }

  public updateAngle(angle: number) {
    this.angle = angle;
  }

  public updateAngleFactor(angleFactor: HitAngleFactor) {
    this.lastAngleFactor = angleFactor;
  }

  public getDetectableArea() {
    const top = this.top - 95;
    const left = this.left - 95;
    const angle = 0;
    return new Bubble({ top, left, angle }, 200);
  }
}
