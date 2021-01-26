import state from './state';
import { CICLES_PER_SECOND } from './constants';

export default class Timer {
  inGame = false;
  timeOut: ReturnType<typeof setTimeout> = 0;
  interval = 1000 / CICLES_PER_SECOND;

  public startGame() {
    this.inGame = true;
    this.makeCicle();
  }

  private makeCicle() {
    this.timeOut = window.setInterval(() => {
      state.cicle += 1;
    }, this.interval);
  }
}
