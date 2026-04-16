import { managers } from './managers';

export class TowerManager {
	update(_deltaTime: number) {
		const entityManager = managers.get('entityManager');
		if (!entityManager) return;

		const towers = entityManager.towers || [];

		for (const tower of towers) {
			if (!tower.isInteractable) continue;

			const stateName = tower.state?.currentState?.name;
			if (stateName === 'NotBuilt') continue;

			// Tower shooting is now handled by the Guard state in the state machine
			// This manager can be used for additional tower-specific logic if needed
		}
	}
}

export const towerManager = new TowerManager();
