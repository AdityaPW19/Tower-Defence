import { BaseState } from '../../BaseState';
import { managers } from '../../managers';
import { Vector2 } from '../../Vector2';
import { soundManager } from '../../soundManager';

export class Shoot extends BaseState {
	update() {
		this.shoot();
		this.entity.addVFX('TowerShoot');
		this.entity.state?.setState('Guard');
	}

	shoot() {
		const stageManager = managers.get('stageManager');
		const entityManager = managers.get('entityManager');

		if (!stageManager || !entityManager) return;

		const { spawner } = this.stateMachine.context;
		const projectileType = spawner.stats.projectileType;
		const projectileNumber = this.entity.stats.projectileNumber || 1;

		const towerShootPoint = spawner.position.add(new Vector2(spawner.width / 2, 0));

		const targets = entityManager.findNearestEntities(
			spawner,
			entityManager.enemies,
			projectileNumber
		);

		targets.forEach((target: any) => {
			stageManager.spawnEntity(projectileType, towerShootPoint, {
				spawner,
				target
			});
		});

		soundManager.play('towerShoot');
	}
}
