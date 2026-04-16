import { BaseState } from '../../BaseState';
import { managers } from '../../managers';

export class Guard extends BaseState {
	cdId: number | null = null;

	constructor(stateMachine: any) {
		super(stateMachine);

		const gameLoop = managers.get('gameLoop');

		if (gameLoop) {
			const attackSpeed = this.entity.stats.attackSpeed || 800;
			this.cdId = gameLoop.setCD(attackSpeed, true);
		}
	}

	update() {
		const { entityManager, gameLoop } = managers.get(['entityManager', 'gameLoop']);

		if (!entityManager || !gameLoop) return;

		const target = entityManager.findNearestEntity(this.entity, entityManager.enemies);

		if (this.cdId !== null && gameLoop.isCDReady(this.cdId) && target) {
			this.stateMachine.setState('Shoot', { spawner: this.entity, target });
		}
	}
}
