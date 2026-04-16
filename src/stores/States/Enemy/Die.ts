import { BaseState } from '../../BaseState';
import { managers } from '../../managers';

export class Die extends BaseState {
	constructor(stateMachine: any) {
		super(stateMachine);

		stateMachine.owner.stopInteractions();
		this.entity.removeCollider();
	}

	update() {
		if (this.entity.animation && this.entity.animation.isComplete) {
			const { entityManager, stageManager } = managers.get(['entityManager', 'stageManager']);
			if (entityManager) {
				entityManager.destroy(this.entity.id);
			}
			if (stageManager) {
				stageManager.spawnLoot(this.entity);
			}
		}
	}
}
