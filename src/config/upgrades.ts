import type { Entity } from '../stores/Entity';

export const FireTower = [
	(_tower: Entity) => {},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	}
];

export const PoisonTower = [
	(_tower: Entity) => {},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	}
];

export const ThunderTower = [
	(_tower: Entity) => {},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	}
];

export const IceTower = [
	(_tower: Entity) => {},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 50;
		tower.stats.projectileNumber += 1;
	},
	(tower: Entity) => {
		tower.stats.attackSpeed -= 30;
		tower.stats.projectileNumber += 1;
	}
];
