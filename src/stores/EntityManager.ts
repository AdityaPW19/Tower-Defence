import { StoreBase } from './storeShim';
import { Entity } from './Entity';
import { Vector2 } from './Vector2';

export class EntityManager extends StoreBase {
	entities: Entity[] = [];

	get enemies() {
		return this.entities.filter((e) => e.type === 'enemy');
	}

	get livingEnemies() {
		return this.enemies.filter((e) => e.isInteractable);
	}

	get projectiles() {
		return this.entities.filter((e) => e.type === 'projectile');
	}

	get livingProjectiles() {
		return this.projectiles.filter((e) => e.isInteractable);
	}

	get towers() {
		return this.entities.filter((e) => e.type === 'tower');
	}

	get topTowers() {
		return this.towers.slice(0, 2);
	}

	get bottomTowers() {
		return this.towers.slice(2);
	}

	get throne() {
		return this.entities.find((e) => e.type === 'throne');
	}

	get loot() {
		return this.entities.filter((e) => e.type === 'loot');
	}

	get livingLoot() {
		return this.loot.filter((e) => e.isInteractable);
	}

	add(entity: Entity | Entity[]) {
		if (Array.isArray(entity)) {
			this.entities = [...this.entities, ...entity];
		} else {
			this.entities = [...this.entities, entity];
		}
		this.emitChange();
	}

	update(deltaTime: number) {
		this.entities.forEach((e) => e.update(deltaTime));
		this.emitChange();
	}

	reset() {
		this.entities = [];
		Entity.lastId = 0;
		this.emitChange();
	}

	filterByName(name: string | string[]) {
		if (Array.isArray(name)) return this.entities.filter((e) => name.includes(e.name));
		return this.entities.filter((e) => e.name === name);
	}

	getByName(name: string) {
		return this.entities.find((e) => e.name === name);
	}

	getById(id: number) {
		return this.entities.find((e) => e.id === id);
	}

	destroy(id: number) {
		const entity = this.getById(id);
		if (entity) {
			entity.destroy();
		}
		this.entities = this.entities.filter((e) => e.id !== id);
		this.emitChange();
	}

	removeById(id: number) {
		this.destroy(id);
	}

	remove(entity: Entity) {
		this.removeById(entity.id);
	}

	findNearestEntity(source: { position: Vector2 }, targets: Entity[]): Entity | undefined {
		const validTargets = targets.filter((t) => t.isInteractable);
		if (validTargets.length === 0) return undefined;
		const distances = validTargets.map((t) => source.position.distance(t.position));
		const min = Math.min(...distances);
		const idx = distances.indexOf(min);
		return validTargets[idx];
	}

	findNearestEntities(source: { position: Vector2 }, targets: Entity[], count: number): Entity[] {
		const validTargets = targets.filter((t) => t.isInteractable);
		if (validTargets.length === 0) return [];

		const sorted = [...validTargets].sort((a, b) => {
			const distA = source.position.distance(a.position);
			const distB = source.position.distance(b.position);
			return distA - distB;
		});

		return sorted.slice(0, count);
	}

	getSnapshot() {
		return {
			entities: this.entities.map((e) => e.getSnapshot()),
			enemyCount: this.enemies.length,
			towerCount: this.towers.length,
			projectileCount: this.projectiles.length
		};
	}
}

export const entityManager = new EntityManager();
