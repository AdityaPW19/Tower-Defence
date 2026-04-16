import { throneCollider, towerCollider } from '../collisionHandlers';
import * as upgrades from '../upgrades';
import { GameConfig } from '../gameConfig';
import type { EntityConfig } from './enemies';

const commonTowerStats = {
	health: GameConfig.subTowerHP,
	maxHealth: GameConfig.subTowerHP,
	attackSpeed: 800,
	projectileNumber: 1
};

export const towers: Record<string, EntityConfig> = {
	Throne: {
		type: 'throne',
		stats: {
			health: GameConfig.mainTowerHP,
			maxHealth: GameConfig.mainTowerHP,
			damage: 999,
			speed: 0
		},
		scale: 0.6,
		stateToAnimation: {
			Idle: 'Throne',
			Die: 'ThroneDestroyed'
		},
		initialState: 'Idle',
		onCollide: throneCollider
	},
	FireTower: {
		type: 'tower',
		initialState: 'NotBuilt',
		stateToAnimation: {
			Guard: 'FireTowerBase0',
			Shoot: 'FireTowerBase0',
			NotBuilt: 'TowerBase',
			Upgrade: 'FireTowerUpgrade0'
		},
		stats: {
			...commonTowerStats,
			projectileType: 'Fireball'
		},
		scale: 0.8,
		upgrades: upgrades.FireTower as any,
		onCollide: towerCollider
	},

	ThunderTower: {
		type: 'tower',
		initialState: 'NotBuilt',
		stateToAnimation: {
			Guard: 'ThunderTowerBase0',
			Shoot: 'ThunderTowerBase0',
			NotBuilt: 'TowerBase',
			Upgrade: 'ThunderTowerUpgrade0'
		},
		stats: {
			...commonTowerStats,
			attackSpeed: 750,
			projectileType: 'Thunderbolt'
		},
		scale: 0.8,
		upgrades: upgrades.ThunderTower as any,
		onCollide: towerCollider
	},

	PoisonTower: {
		type: 'tower',
		initialState: 'NotBuilt',
		stateToAnimation: {
			Guard: 'PoisonTowerBase0',
			Shoot: 'PoisonTowerBase0',
			NotBuilt: 'TowerBase',
			Upgrade: 'PoisonTowerUpgrade0'
		},
		stats: {
			...commonTowerStats,
			projectileType: 'Poisonball'
		},
		scale: 0.8,
		upgrades: upgrades.PoisonTower as any,
		onCollide: towerCollider
	},

	IceTower: {
		type: 'tower',
		initialState: 'NotBuilt',
		stateToAnimation: {
			Guard: 'IceTowerBase0',
			Shoot: 'IceTowerBase0',
			NotBuilt: 'TowerBase',
			Upgrade: 'IceTowerUpgrade0'
		},
		stats: {
			...commonTowerStats,
			attackSpeed: 850,
			projectileType: 'Icebolt'
		},
		scale: 0.8,
		upgrades: upgrades.IceTower as any,
		onCollide: towerCollider
	}
};
