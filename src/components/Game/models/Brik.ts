import { v4 as uuidv4 } from 'uuid';
import GameBrikInterface from '../interfaces/GameBrik';

export default class Brik {
  public readonly id = uuidv4();
  public readonly brikLength = 20;
  public top: number;
  public left: number;
  public score: number;

  constructor({ top, left, score }: GameBrikInterface) {
    this.top = top;
    this.left = left;
    this.score = score;
  }

  public updateScore(score: number) {
    this.score += score;
  }
}
