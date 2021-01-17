import { v4 as uuidv4 } from 'uuid';
import BaseBubble from '../interfaces/BaseBubble';
import { HitAngleFactor } from '../enums/HitAngleFactor';
import {
  BUBBLE_DIAMETER,
} from '../constants';

export default class Bubble {
  public readonly id = uuidv4();
  public readonly diameter = BUBBLE_DIAMETER;
  public top: number;
  public left: number;
  public angle: number;
  public lastAngleFactor = HitAngleFactor.NONE;
  private lastHitBrik?: string;

  constructor({
    top,
    left,
    angle,
  }: BaseBubble) {
    this.top = top;
    this.left = left;
    this.angle = angle;
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

  public updateAngleFactor(angleFactor: HitAngleFactor) {
    this.lastAngleFactor = angleFactor;
  }
}
