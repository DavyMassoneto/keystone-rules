export class SettleController {
  #settled = false;
  #timer = null;

  setTimer(timer) {
    this.#timer = timer;
  }

  settle(callback, value) {
    if (this.#settled) {
      return;
    }
    this.#settled = true;
    if (this.#timer) {
      clearTimeout(this.#timer);
    }
    callback(value);
  }
}
