import { BaseState } from '../../BaseState';
import { screen } from '../../Screen';

export class NotBuilt extends BaseState {
	isSetup = false;

	update(_deltaTime: number): void {
		if (!this.isSetup) {
			if (screen.isMobile) {
				this.entity.position.y += 30;
			} else {
				this.entity.position.y += 35;
			}

			this.isSetup = true;
		}
	}
}
