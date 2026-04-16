import { managers } from './managers';
import { screen } from './Screen';
import { checkRectCollision } from '../utils/math';

export class CollisionManager {
  update() {
    const entityManager = managers.get('entityManager');
    if (!entityManager) return;

    this.handleEnemyCollisions(entityManager.livingEnemies, entityManager.livingProjectiles, entityManager.throne);
    this.handleProjectileCollisions(entityManager.livingProjectiles);
    this.handleLootCollisions(entityManager.livingLoot, entityManager.throne);
  }

  handleEnemyCollisions(enemies: any[], projectiles: any[], throne: any) {
    const GRID_SIZE = 100;
    const grid = new Map<string, any[]>();

    const getGridKeys = (entity: any) => {
      const { x1, y1, x2, y2 } = entity.boundingBox;
      const startX = Math.floor(x1 / GRID_SIZE);
      const startY = Math.floor(y1 / GRID_SIZE);
      const endX = Math.floor(x2 / GRID_SIZE);
      const endY = Math.floor(y2 / GRID_SIZE);

      const keys: string[] = [];
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          keys.push(`${i},${j}`);
        }
      }
      return keys;
    };

    for (const enemy of enemies) {
      const keys = getGridKeys(enemy);
      for (const key of keys) {
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(enemy);
      }

      if (throne && this.checkCollision(enemy, throne)) {
        if (typeof enemy.onCollide === 'function') enemy.onCollide(throne);
        if (typeof throne.onCollide === 'function') throne.onCollide(enemy);
      }
    }

    for (const projectile of projectiles) {
      const keys = getGridKeys(projectile);
      const checkedEnemies = new Set<any>();

      for (const key of keys) {
        const enemiesInCell = grid.get(key);
        if (enemiesInCell) {
          for (const enemy of enemiesInCell) {
            if (checkedEnemies.has(enemy)) continue;
            if (this.checkCollision(projectile, enemy)) {
              if (typeof projectile.onCollide === 'function') projectile.onCollide(enemy);
              if (typeof enemy.onCollide === 'function') enemy.onCollide(projectile);
              checkedEnemies.add(enemy);
            }
          }
        }
      }
    }
  }

  handleProjectileCollisions(projectiles: any[]) {
    for (const projectile of projectiles) {
      if (!this.checkScreenBounds(projectile)) {
        if (typeof projectile.onCollide === 'function') projectile.onCollide('OUT_OF_BOUNDS');
      }
    }
  }

  handleLootCollisions(lootEntities: any[], throne: any) {
    lootEntities.forEach((loot) => {
      if (this.checkCollision(loot, throne)) {
        if (typeof loot.onCollide === 'function') loot.onCollide(throne);
        if (typeof throne.onCollide === 'function') throne.onCollide(loot);
      }
    });
  }

  checkCollision(entity1: any, entity2: any) {
    if (!entity1 || !entity2) return false;
    return checkRectCollision(entity1.boundingBox, entity2.boundingBox);
  }

  filterEnemiesByBounds = (bounds: any) => {
    const entityManager = managers.get('entityManager');
    if (!entityManager) return [];
    return entityManager.livingEnemies.filter((entity: any) => checkRectCollision(entity.boundingBox, bounds));
  };

  checkBounds(entity: any, boundsRect: any) {
    return checkRectCollision(entity.boundingBox, boundsRect);
  }

  checkScreenBounds(entity: any) {
    return checkRectCollision(entity.boundingBox, screen.screenBounds);
  }

  checkGameBounds(entity: any) {
    return checkRectCollision(entity.boundingBox, screen.gameBoundingBox);
  }
}

export const collisionManager = new CollisionManager();
