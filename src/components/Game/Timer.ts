import state from './state';

export default class Timer {
  inGame = false;
  timeOut: ReturnType<typeof setTimeout> = 0;

  public startGame() {
    this.inGame = true;
    this.makeCicle();
  }

  private makeCicle() {
    this.timeOut = window.setInterval(() => {
      state.cicle += 1;
    }, 10);
  }
}
