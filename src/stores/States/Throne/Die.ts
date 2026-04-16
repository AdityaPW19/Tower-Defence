import { managers } from '../../managers';
import { BaseState } from '../../BaseState';
import { soundManager } from '../../soundManager';

export class Die extends BaseState {
	constructor(stateMachine: any) {
		super(stateMachine);

		this.entity.stopInteractions();
		this.entity.addVFX('Explosion');
		soundManager.play('destruction');

		setTimeout(() => {
			const stageManager = managers.get('stageManager');
			if (stageManager) {
				stageManager.gameOver('lose');
			}
		}, 2000);
	}
}
