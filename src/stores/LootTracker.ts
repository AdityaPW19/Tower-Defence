import { boundingBoxFromPoint } from '../utils/math';
import { soundManager } from './soundManager';
import { managers } from './managers';
import { screen } from './Screen';
import { StoreBase } from './storeShim';
import { Vector2 } from './Vector2';

const LOOT_MAP: Record<string, number> = {
	click: 5,
	upgrade: 35
};

export class LootTracker extends StoreBase {
	collectedLoot = 100;
	playLowLootAnimation = false;
	playTowerUpgradeAnimation = false;
	playEnemyClickAnimation = false;
	score = 100;
	killsEnemy = 0;

	spendLoot(action: any) {
		const toSpend = LOOT_MAP[action.type];

		if (action.type === 'upgrade') {
			const questionManager = managers.get('questionManager');
			const entityManager = managers.get('entityManager');
			
			// Get the actual tower entity from EntityManager (not snapshot)
			let tower = action.payload?.tower;
			if (tower && typeof tower.id === 'number' && entityManager) {
				tower = entityManager.getById(tower.id) || tower;
			}

			if (!tower) {
				this.playAnimation('LowLoot');
				this.emitChange();
				return;
			}

			const stateName = tower.state?.currentState?.name;
			const isNotBuilt = stateName === 'NotBuilt';

			if (isNotBuilt) {
				if (questionManager && questionManager.buildPoints > 0) {
					questionManager.buildPoints--;
					
					if (tower.state && typeof tower.state.setState === 'function') {
						tower.state.setState('Guard');
					}
					
					tower.stats.health = tower.stats.maxHealth || 3;
					tower.upgradeLevel = 0;
					tower.isInteractable = true;
					
					soundManager.play('towerUpgrade');
				} else {
					this.playAnimation('LowLoot');
					soundManager.play('lowResourse');
				}
				this.emitChange();
				return;
			}

			// Upgrade existing tower
			const maxLevel = tower.upgradeLevel >= 2;
			if (maxLevel) {
				this.playAnimation('LowLoot');
				this.emitChange();
				return;
			}

			if (this.collectedLoot >= toSpend) {
				if (questionManager && questionManager.buildPoints > 0) {
					this.collectedLoot -= toSpend;
					questionManager.buildPoints--;
					
					if (tower.state && typeof tower.state.setState === 'function') {
						tower.state.setState('Upgrade');
					}
					
					this.playAnimation('TowerUpgrade');
				} else {
					this.playAnimation('LowLoot');
					soundManager.play('lowResourse');
				}
			} else {
				this.playAnimation('LowLoot');
				soundManager.play('lowResourse');
			}
			this.emitChange();
			return;
		}

		// Click attack
		if (this.collectedLoot < toSpend) {
			this.playAnimation('LowLoot');
			soundManager.play('lowResourse');
			this.emitChange();
			return;
		}

		if (action.type === 'click') {
			const collisionManager = managers.get('collisionManager');
			const stageManager = managers.get('stageManager');
			const offset = action.payload?.offset;
			
			if (!offset) return;

			const position = offset instanceof Vector2 ? offset : new Vector2(offset.x, offset.y);
			// Smaller hit area on mobile where enemies are scaled down (-0.3) and
			// often touch each other; prevents accidental multi-kills.
			const hitSize = screen.isMobile ? 36 : 50;
			const boundingBox = boundingBoxFromPoint(position, hitSize, hitSize);
			const candidates = collisionManager ? collisionManager.filterEnemiesByBounds(boundingBox) : [];

			if (stageManager && typeof stageManager.spawnEntity === 'function') {
				stageManager.spawnEntity('ClickExplode', position);
			}

			soundManager.play('clickEnemy', true);

			// One click = one kill. Pick the enemy whose VISUAL CENTER is closest to
			// the tap. entity.position is the top-left of the natural-size image, so
			// we offset by half width/height to get the actual rendered center.
			let target: any = null;
			let minDist = Infinity;
			for (const enemy of candidates) {
				if (!enemy?.position) continue;
				const cx = enemy.position.x + (enemy.width || 0) / 2;
				const cy = enemy.position.y + (enemy.height || 0) / 2;
				const dx = cx - position.x;
				const dy = cy - position.y;
				const d = dx * dx + dy * dy;
				if (d < minDist) {
					minDist = d;
					target = enemy;
				}
			}

			if (target && target.state && typeof target.state.setState === 'function') {
				target.state.setState('Die');
				this.collectedLoot -= toSpend;
			}
			this.emitChange();
		}
	}

	receiveLoot(loot: number) {
		this.collectedLoot += loot;
		this.score += loot;
		this.killsEnemy++;
		this.emitChange();
	}

	reset() {
		this.collectedLoot = 100;
		this.score = 100;
		this.killsEnemy = 0;
		this.playLowLootAnimation = false;
		this.playTowerUpgradeAnimation = false;
		this.playEnemyClickAnimation = false;
		this.emitChange();
	}

	getAnimation(name: string) {
		return `play${name}Animation`;
	}

	playAnimation(name: string) {
		const animation = this.getAnimation(name);
		(this as any)[animation] = true;
		this.emitChange();
		
		// Auto-reset after short delay
		setTimeout(() => {
			(this as any)[animation] = false;
			this.emitChange();
		}, 500);
	}

	unsetAnimation(name: string) {
		const animation = this.getAnimation(name);
		(this as any)[animation] = false;
		this.emitChange();
	}

	getSnapshot() {
		return {
			collectedLoot: this.collectedLoot,
			playLowLootAnimation: this.playLowLootAnimation,
			playTowerUpgradeAnimation: this.playTowerUpgradeAnimation,
			playEnemyClickAnimation: this.playEnemyClickAnimation,
			score: this.score,
			killsEnemy: this.killsEnemy
		};
	}
}

export const lootTracker = new LootTracker();
