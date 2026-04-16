import { BaseState } from '../../BaseState';
import { getAnimation } from '../../../config/animations';
import { Animation } from '../../Animation';
import { soundManager } from '../../soundManager';

export class Idle extends BaseState {
	lastAnimName = '';

	update(_dt: number, entity: any) {
		if (!entity || !entity.stats) return;

		const healthPct = entity.stats.health / entity.stats.maxHealth;
		let animName = 'Throne';

		if (healthPct <= 0) animName = 'ThroneDestroyed';
		else if (healthPct < 0.25) animName = 'ThroneDamaged3';
		else if (healthPct < 0.50) animName = 'ThroneDamaged2';
		else if (healthPct < 0.75) animName = 'ThroneDamaged1';

		if (entity.animation && entity.animation.name !== animName) {
			if (this.lastAnimName && this.lastAnimName !== animName) {
				entity.removeVFX('Smoke');
				entity.addVFX('Smoke');
				soundManager.play('break');
			}

			try {
				const config = getAnimation(animName);
				entity.animation = new Animation(config);
			} catch (e) {
				// Animation not found, keep current
			}
			this.lastAnimName = animName;
		} else if (!this.lastAnimName && entity.animation) {
			this.lastAnimName = entity.animation.name;
		}
	}
}
