import { BaseState } from '../../BaseState';
import { managers } from '../../managers';

export class Explode extends BaseState {
	constructor(stateMachine: any) {
		super(stateMachine);

		this.entity.removeCollider();
		this.entity.width = 30;
		this.entity.height = 30;

		if (this.entity.animation) {
			this.entity.animation.onFrameChange = (_frame: number) => {
				this.entity.scale += 0.5;
			};
		}

		stateMachine.owner.stopInteractions();
	}

	update() {
		if (!this.entity.animation || (this.entity.animation && this.entity.animation.isComplete)) {
			const entityManager = managers.get('entityManager');
			if (entityManager) {
				entityManager.destroy(this.entity.id);
			}

			if (this.entity.animation) {
				this.entity.animation.onFrameChange = () => {};
			}
		}
	}
}
