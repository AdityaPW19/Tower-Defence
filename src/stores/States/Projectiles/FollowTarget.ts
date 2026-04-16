import { BaseState } from '../../BaseState';
import { angleToTarget, boundingBoxFromPoint, getDirectionFromAngle } from '../../../utils/math';
import { Vector2 } from '../../Vector2';

export class FollowTarget extends BaseState {
	private lastAngle = 0;
	private rotationOffset = 90;

	update(deltaTime: number) {
		const { target } = this.stateMachine.context;

		if (target?.isInteractable) {
			this.followTarget(deltaTime, target);
		} else {
			this.stateMachine.setState('FollowAngle', {
				angle: this.lastAngle
			});
		}
	}

	getTopMiddlePoint(entity: any): Vector2 {
		const boundingBox = boundingBoxFromPoint(entity.position, entity.width, entity.height);
		return boundingBox.topMiddle;
	}

	followTarget(deltaTime: number, target: any) {
		const entityCenter = this.entity.boundingBox.center;

		this.lastAngle = angleToTarget(entityCenter, target.boundingBox.center);

		this.entity.rotation = (this.lastAngle * 180) / Math.PI + this.rotationOffset;

		const direction = getDirectionFromAngle(this.lastAngle);

		const velocity = direction.multiply(this.entity.stats.speed * deltaTime);

		this.entity.position = this.entity.position.add(velocity);
	}
}
