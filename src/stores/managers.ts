export class Managers {
  managers: Record<string, any> = {};

  setup = (managers: any) => {
    this.managers = managers;
  };

  update = (deltaTime: number) => {
    if (this.managers.stageManager) this.managers.stageManager.update(deltaTime);
    if (this.managers.entityManager) this.managers.entityManager.update(deltaTime);
    if (this.managers.towerManager) this.managers.towerManager.update(deltaTime);
    if (this.managers.collisionManager) this.managers.collisionManager.update();
    if (this.managers.questionManager) this.managers.questionManager.update(deltaTime);
    if (this.managers.particleManager) this.managers.particleManager.update(deltaTime);
  };

  get = (name: string | string[]) => {
    if (typeof name === 'string') {
      return this.managers[name];
    }

    const acc: Record<string, any> = {};
    (name as string[]).forEach((n) => (acc[n] = this.managers[n]));
    return acc;
  };
}

export const managers = new Managers();
