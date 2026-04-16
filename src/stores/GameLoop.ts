export class GameLoop {
  static lastCDId = 0;

  previousTime = 0;
  accumulator = 0;
  elapsedTime = 0;
  timeScale = 1.0;
  pauseState: { pausedTime: number } | null = null;
  isStopped = false;
  cooldowns = new Map<number, { startTime: number; waitTime: number; isInfinite: boolean }>();

  update: (deltaTime: number) => void = () => {};

  constructor() {
    this.loop = this.loop.bind(this);
  }

  get elapsedInSeconds() {
    return this.elapsedTime / 1000;
  }

  start(update: (deltaTime: number) => void) {
    this.isStopped = false;
    this.pauseState = null;
    this.timeScale = 1.0;
    this.update = update;
    this.previousTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isStopped = true;
    this.pauseState = null;
  }

  reset() {
    this.previousTime = 0;
    this.elapsedTime = 0;
    this.accumulator = 0;
  }

  loop(currentTime: number) {
    if (this.isStopped) return;

    if (this.pauseState) {
      this.previousTime = currentTime;
      requestAnimationFrame(this.loop);
      return;
    }

    let frameTime = currentTime - this.previousTime;

    if (frameTime > 250) frameTime = 250;

    this.previousTime = currentTime;
    this.accumulator += frameTime * this.timeScale;
    this.elapsedTime += frameTime * this.timeScale;

    const MS_PER_UPDATE = 16.666;
    while (this.accumulator >= MS_PER_UPDATE) {
      this.update(MS_PER_UPDATE);
      this.accumulator -= MS_PER_UPDATE;
    }

    requestAnimationFrame(this.loop);
  }

  setCD(waitTime: number, isInfinite = false) {
    const id = GameLoop.lastCDId++;
    this.cooldowns.set(id, {
      startTime: this.elapsedTime,
      waitTime,
      isInfinite
    });
    return id;
  }

  isCDReady(cooldownId: number) {
    const cd = this.cooldowns.get(cooldownId);
    if (!cd || this.pauseState) return false;

    const elapsedCD = this.elapsedTime - cd.startTime;
    if (elapsedCD <= cd.waitTime) return false;

    if (cd.isInfinite) {
      this.cooldowns.set(cooldownId, { ...cd, startTime: this.elapsedTime });
      return true;
    } else {
      this.cooldowns.delete(cooldownId);
      return true;
    }
  }

  pause() {
    if (!this.pauseState) {
      this.pauseState = { pausedTime: this.elapsedTime };
    } else {
      this.resume();
    }
  }

  resume() {
    if (!this.pauseState) return;
    this.previousTime = performance.now();
    this.pauseState = null;
  }
}
