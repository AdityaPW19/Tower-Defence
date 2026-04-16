import React, { useState, useEffect, useCallback } from 'react';
import { managers } from '../stores/managers';
import { lootTracker } from '../stores/LootTracker';
import DynamicEntity from './DynamicEntity';
import StaticEntity from './StaticEntity';
import ParticleLayer from './ParticleLayer';
import HealthBar from './HealthBar';

const GameArea: React.FC = () => {
	const [entities, setEntities] = useState<any[]>([]);
	const [throne, setThrone] = useState<any>(null);

	useEffect(() => {
		let rafId: number;
		const tick = () => {
			const entityManager = managers.get('entityManager');
			if (entityManager) {
				setEntities([...entityManager.entities]);
				setThrone(entityManager.throne);
			}
			rafId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleTowerClick = useCallback((tower: any) => (e: React.MouseEvent) => {
		e.stopPropagation();
		if (tower.upgradeLevel === 2 || !tower.isUpgradable) return;
		lootTracker.spendLoot({ type: 'upgrade', payload: { tower } });
	}, []);

	const loot = entities.filter(e => e.type === 'loot');
	const projectiles = entities.filter(e => e.type === 'projectile');
	const enemies = entities.filter(e => e.type === 'enemy');
	const towers = entities.filter(e => e.type === 'tower');
	const topTowers = towers.slice(0, 2);
	const bottomTowers = towers.slice(2);

	return (
		<section className="game-area">
			<div className="grid-plane" />

			{loot.map(entity => (
				<DynamicEntity key={entity.id} entity={entity} zIndex={11} />
			))}

			{projectiles.map(entity => (
				<DynamicEntity key={entity.id} entity={entity} zIndex={12} />
			))}

			{enemies.map(entity => (
				<DynamicEntity key={entity.id} entity={entity} zIndex={5} />
			))}

			<div className="towers">
				{topTowers.map((tower, index) => (
					<div key={tower.id} className="tower-wrapper">
						<StaticEntity 
							entity={tower} 
							onClick={handleTowerClick(tower)}
							style={{
								marginLeft: index === 0 ? '12px' : '0',
								marginRight: index === 1 ? '12px' : '0'
							}}
						/>
					</div>
				))}
			</div>

			<div className="throne">
				{throne && (
					<>
						<StaticEntity entity={throne} />
						<HealthBar entity={throne} />
					</>
				)}
			</div>

			<div className="towers">
				{bottomTowers.map((tower, index) => (
					<div key={tower.id} className="tower-wrapper">
						<StaticEntity 
							entity={tower} 
							onClick={handleTowerClick(tower)}
							style={{
								marginLeft: index === 0 ? '12px' : '0',
								marginRight: index === 1 ? '12px' : '0'
							}}
						/>
					</div>
				))}
			</div>

			<ParticleLayer />
		</section>
	);
};

export default GameArea;
