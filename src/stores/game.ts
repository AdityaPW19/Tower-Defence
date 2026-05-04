import { managers } from './managers';
import { GameLoop } from './GameLoop';
import { StageManager } from './StageManager';
import { TowerManager } from './TowerManager';
import { collisionManager } from './CollisionManager';
import { particleManager } from './ParticleManager';
import { lootTracker } from './LootTracker';
import { soundManager } from './soundManager';
import { entityManager } from './EntityManager';
import { questionManager } from './QuestionManager';

export class Game {
	isStarted = false;

	update = (deltaTime: number) => {
		managers.update(deltaTime);
	};

	start = async () => {
		// Reset entity ID counter
		entityManager.reset();
		
		// Setup all managers
		managers.setup(setupManagers());

		const { gameLoop, stageManager } = managers.get([
			'gameLoop',
			'stageManager'
		]);

		// Initialize stage (spawns towers and throne)
		stageManager?.init();

		// Reset question manager
		questionManager.reset();
		if (questionManager.questionQueue.length < 3) {
			questionManager.fetchQuestions();
		}

		// Start the game loop
		gameLoop?.start(this.update);

		// Play background music
		soundManager.play('bgSound');

		this.isStarted = true;
	};

	restart = () => {
		const { entityManager, gameLoop, stageManager } = managers.get([
			'entityManager',
			'gameLoop',
			'stageManager'
		]);

		// Stop the game loop first
		gameLoop?.stop();
		gameLoop?.reset();

		// Reset all managers
		entityManager?.reset();
		lootTracker?.reset();
		questionManager?.reset();
		soundManager?.reset?.();
		particleManager?.reset?.();

		// Reinitialize
		stageManager?.reset();

		// Resume game loop
		gameLoop?.start(this.update);
		
		soundManager.play('bgSound');
	};

	cleanup = async () => {
		if (!this.isStarted) return;

		soundManager.pause('bgSound');

		try {
			const gameLoop = managers.get('gameLoop');
			if (gameLoop) {
				gameLoop.stop();
				gameLoop.reset();
			}
		} catch (e) {
			// ignore
		}

		const stageManager = managers.get('stageManager');
		entityManager?.reset?.();
		lootTracker?.reset?.();
		questionManager?.reset?.();
		particleManager?.reset?.();
		if (stageManager) {
			stageManager.stageNumber = 0;
			stageManager.stageResult = '';
			stageManager.stageStartTime = 0;
			stageManager.commonSpawnCd = null;
			stageManager.eliteSpawnCd = null;
		}

		this.isStarted = false;
	};
}

const setupManagers = () => {
	const managersObj: Record<string, any> = {
		collisionManager: collisionManager,
		entityManager: entityManager,
		gameLoop: new GameLoop(),
		stageManager: new StageManager(),
		towerManager: new TowerManager(),
		questionManager: questionManager,
		particleManager: particleManager,
		lootTracker: lootTracker
	};

	return managersObj;
};

export const game = new Game();
