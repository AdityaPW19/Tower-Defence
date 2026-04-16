import { soundManager } from '../../soundManager';
import { BaseState } from '../../BaseState';

const getPrefix = (level: number) => {
	if (level === 1) {
		return '1';
	} else if (level === 2) {
		return '2';
	}
	return '0';
};

const getUpgradeAnimationName = (tower: any, level: number) => {
	return `${tower.name}Upgrade${getPrefix(level)}`;
};

const getGuardAnimationName = (tower: any, level: number) => {
	return `${tower.name}Base${getPrefix(level)}`;
};

export class Upgrade extends BaseState {
	constructor(stateMachine: any) {
		super(stateMachine);

		this.entity.upgradeLevel += 1;

		const upgradeFn = this.entity.upgrades[this.entity.upgradeLevel];
		if (upgradeFn) {
			upgradeFn(this.entity);
		}

		if (this.entity.animation) {
			this.entity.animation.onFrameChange = (_frame: number) => {
				// Optional: this.entity.scale += 0.1;
			};
		}

		soundManager.play('towerUpgrade');
	}

	update(_deltaTime: number) {
		if (this.entity.animation && this.entity.animation.isComplete) {
			this.entity.stateToAnimation = {
				...this.entity.stateToAnimation,
				Guard: getGuardAnimationName(this.entity, this.entity.upgradeLevel),
				Shoot: getGuardAnimationName(this.entity, this.entity.upgradeLevel),
				Upgrade: getUpgradeAnimationName(this.entity, this.entity.upgradeLevel + 1)
			};

			this.entity.state?.setState('Guard');
			if (this.entity.animation) {
				this.entity.animation.onFrameChange = () => {};
			}
		}
	}
}
