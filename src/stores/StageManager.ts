import { StoreBase } from './storeShim';
import { stages } from '../config/stages';
import { initEntity } from './entityFabric';
import { managers } from './managers';
import { Vector2 } from './Vector2';
import { screen } from './Screen';

const getSpawnZones = () => ({
	top: [
		{ x: screen.width * 0.1, y: 20 },
		{ x: screen.width * 0.3, y: 20 },
		{ x: screen.width * 0.5, y: 20 },
		{ x: screen.width * 0.7, y: 20 },
		{ x: screen.width * 0.9, y: 20 }
	],
	bottom: [
		{ x: screen.width * 0.1, y: screen.height - 20 },
		{ x: screen.width * 0.3, y: screen.height - 20 },
		{ x: screen.width * 0.5, y: screen.height - 20 },
		{ x: screen.width * 0.7, y: screen.height - 20 },
		{ x: screen.width * 0.9, y: screen.height - 20 }
	],
	left: [
		{ x: 20, y: screen.height * 0.1 },
		{ x: 20, y: screen.height * 0.3 },
		{ x: 20, y: screen.height * 0.5 },
		{ x: 20, y: screen.height * 0.7 },
		{ x: 20, y: screen.height * 0.9 }
	],
	right: [
		{ x: screen.width - 20, y: screen.height * 0.1 },
		{ x: screen.width - 20, y: screen.height * 0.3 },
		{ x: screen.width - 20, y: screen.height * 0.5 },
		{ x: screen.width - 20, y: screen.height * 0.7 },
		{ x: screen.width - 20, y: screen.height * 0.9 }
	]
});

const getRandomSpawnPoint = () => {
	const availableZones = screen.isMobile ? ['top', 'bottom'] : ['top', 'bottom', 'left', 'right'];
	const selectedZone = availableZones[Math.floor(Math.random() * availableZones.length)];
	const spawnPoints = (getSpawnZones() as any)[selectedZone];
	return spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
};

const pickRandomEnemy = (enemies: string[]) => enemies[Math.floor(Math.random() * enemies.length)];

export class StageManager extends StoreBase {
	stageNumber = 0;
	stageStartTime = 0;
	commonSpawnCd: number | null = null;
	eliteSpawnCd: number | null = null;
	stageResult: 'win' | 'lose' | '' = '';

	get stageConfig() {
		return stages[this.stageNumber];
	}

	init() {
		const gameLoop = managers.get('gameLoop');
		if (gameLoop) {
			this.commonSpawnCd = gameLoop.setCD(this.stageConfig.spawnDelays.common, true);
			this.eliteSpawnCd = gameLoop.setCD(this.stageConfig.spawnDelays.elite, true);
		}

		this.spawnTowers();
		this.spawnThrone();
		this.emitChange();
	}

	reset() {
		this.commonSpawnCd = null;
		this.eliteSpawnCd = null;
		this.stageNumber = 0;
		this.stageResult = '';
		this.stageStartTime = 0;

		this.init();
	}

	update(_deltaTime: number) {
		const gameLoop: any = managers.get('gameLoop');
		if (!gameLoop) return;

		if (this.commonSpawnCd !== null && gameLoop.isCDReady(this.commonSpawnCd)) {
			this.spawnEnemy('common');
		}

		if (this.eliteSpawnCd !== null && gameLoop.isCDReady(this.eliteSpawnCd)) {
			this.spawnEnemy('elite');
		}

		this.checkStageTime();
	}

	spawnThrone() {
		const entityManager = managers.get('entityManager');
		if (!entityManager) return;

		const throneX = screen.width / 2 - 64;
		const throneY = screen.height / 2 - 64;
		this.spawnEntity('Throne', new Vector2(throneX, throneY));
	}

	spawnTowers() {
		const entityManager = managers.get('entityManager');
		if (!entityManager) return;

		const centerX = screen.width / 2;
		const centerY = screen.height / 2;
		const towerOffset = 120;

		const towerPositions = [
			{ name: 'IceTower', x: centerX - towerOffset - 32, y: centerY - towerOffset - 32 },
			{ name: 'FireTower', x: centerX + towerOffset - 32, y: centerY - towerOffset - 32 },
			{ name: 'PoisonTower', x: centerX - towerOffset - 32, y: centerY + towerOffset - 32 },
			{ name: 'ThunderTower', x: centerX + towerOffset - 32, y: centerY + towerOffset - 32 }
		];

		towerPositions.forEach(({ name, x, y }) => {
			this.spawnEntity(name, new Vector2(x, y));
		});
	}

	applyAmplify(entity: any) {
		const { statsAmplify } = this.stageConfig;
		if (!entity || !entity.stats) return;
		entity.stats.health *= statsAmplify.health;
		entity.stats.damage *= statsAmplify.damage;
		entity.stats.speed *= statsAmplify.speed;
	}

	spawnEnemy(type: 'common' | 'elite') {
		const entityManager = managers.get('entityManager');
		if (!entityManager) return;

		const enemies = type === 'common' ? this.stageConfig.commonEnemies : this.stageConfig.eliteEnemies;
		const enemyName = pickRandomEnemy(enemies);
		const spawnPoint = getRandomSpawnPoint();
		const position = new Vector2(spawnPoint.x, spawnPoint.y);

		const throne = entityManager.throne;
		const entity = this.spawnEntity(enemyName, position, { throne });
		this.applyAmplify(entity);
		return entity;
	}

	spawnLoot(enemy: any) {
		const entityManager = managers.get('entityManager');
		if (!entityManager) return;
		const throne = entityManager.throne;

		this.spawnEntity('Loot', enemy.boundingBox.center, {
			target: throne
		});
	}

	gameOver(result: 'win' | 'lose') {
		this.stageResult = result;
		const gameLoop = managers.get('gameLoop');
		if (gameLoop) gameLoop.pause();
		this.emitChange();
	}

	checkStageTime() {
		const gameLoop = managers.get('gameLoop');
		if (!gameLoop) return;

		if (this.stageStartTime + this.stageConfig.time < gameLoop.elapsedTime) {
			this.nextStage();
		}
	}

	nextStage() {
		if (this.stageNumber < stages.length - 1) {
			const gameLoop = managers.get('gameLoop');
			this.stageNumber++;
			if (gameLoop) this.stageStartTime = gameLoop.elapsedTime;

			if (gameLoop) {
				this.commonSpawnCd = gameLoop.setCD(this.stageConfig.spawnDelays.common, true);
				this.eliteSpawnCd = gameLoop.setCD(this.stageConfig.spawnDelays.elite, true);
			}
			this.emitChange();
		} else {
			this.gameOver('win');
		}
	}

	spawnEntity(name: string, position: Vector2, context: any = {}) {
		const entityManager = managers.get('entityManager');
		const entity = initEntity(name, position, context);
		if (entityManager) entityManager.add(entity);
		return entity;
	}

	getSnapshot() {
		return {
			stageNumber: this.stageNumber,
			stageResult: this.stageResult,
			stageName: this.stageConfig?.name || 'Unknown'
		};
	}
}
