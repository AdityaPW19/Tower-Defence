import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { managers } from '../stores/managers';
import { lootTracker } from '../stores/LootTracker';
import DynamicEntity from './DynamicEntity';
import StaticEntity from './StaticEntity';
import ParticleLayer from './ParticleLayer';
import HealthBar from './HealthBar';

const GameArea: React.FC = () => {
	const [, forceTick] = useState(0);
	const entitiesRef = useRef<any[]>([]);
	const throneRef = useRef<any>(null);
	const lastEntitiesRef = useRef<any[] | null>(null);

	useEffect(() => {
		let rafId: number;
		const tick = () => {
			const entityManager = managers.get('entityManager');
			if (entityManager) {
				const currentEntities = entityManager.entities;
				if (currentEntities !== lastEntitiesRef.current) {
					lastEntitiesRef.current = currentEntities;
					entitiesRef.current = currentEntities.slice();
					throneRef.current = entityManager.throne;
				}
				forceTick((n) => (n + 1) & 0xffff);
			}
			rafId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleTowerClick = useCallback(
		(tower: any) => (e: React.MouseEvent) => {
			e.stopPropagation();
			if (tower.upgradeLevel === 2 || !tower.isUpgradable) return;
			lootTracker.spendLoot({ type: 'upgrade', payload: { tower } });
		},
		[]
	);

	const entities = entitiesRef.current;
	const throne = throneRef.current;

	const { loot, projectiles, enemies, topTowers, bottomTowers } = useMemo(() => {
		const loot: any[] = [];
		const projectiles: any[] = [];
		const enemies: any[] = [];
		const towers: any[] = [];
		for (const e of entities) {
			switch (e.type) {
				case 'loot':
					loot.push(e);
					break;
				case 'projectile':
					projectiles.push(e);
					break;
				case 'enemy':
					enemies.push(e);
					break;
				case 'tower':
					towers.push(e);
					break;
			}
		}
		return {
			loot,
			projectiles,
			enemies,
			topTowers: towers.slice(0, 2),
			bottomTowers: towers.slice(2)
		};
	}, [entities]);

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
