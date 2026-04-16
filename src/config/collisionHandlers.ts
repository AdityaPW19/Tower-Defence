import type { Entity } from '../stores/Entity';
import { lootTracker } from '../stores/LootTracker';
import { managers } from '../stores/managers';
import { soundManager } from '../stores/soundManager';

export const enemyCollider = (entity: Entity, other: Entity) => {
	entity.takeDamage(other.stats.damage);
};

export const fireballCollider = (fireball: Entity, _other: Entity) => {
	fireball.state?.setState('Explode');
};

export const projectileCollider = (projectile: Entity, other: any) => {
	if (other === 'OUT_OF_BOUNDS') {
		projectile.stopInteractions();
		const entityManager = managers.get('entityManager');
		if (entityManager) {
			entityManager.destroy(projectile.id);
		}
	} else {
		projectile.state?.setState('Explode');
	}
};

export const throneCollider = (entity: Entity, other: Entity) => {
	if (other.type === 'loot') {
		lootTracker.receiveLoot(1);
		soundManager.play('pickUp');
	} else if (other.type === 'enemy') {
		entity.takeDamage(other.stats.damage);
	}
};

export const towerCollider = (entity: Entity, other: Entity) => {
	if (other.type === 'enemy') {
		entity.takeDamage(1);
		other.takeDamage(999);
	}
};

export const lootCollider = (entity: Entity, _other: Entity) => {
	entity.stopInteractions();
	const entityManager = managers.get('entityManager');
	if (entityManager) {
		entityManager.destroy(entity.id);
	}
};
