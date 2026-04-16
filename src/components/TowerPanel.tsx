import React from 'react';
import { useStore } from '../stores/storeShim';
import { entityManager } from '../stores/EntityManager';
import { lootTracker } from '../stores/LootTracker';
import { questionManager } from '../stores/QuestionManager';

const TowerPanel: React.FC = () => {
	const snapshot: any = useStore(entityManager as any, (s: any) => s);
	const qSnap: any = useStore(questionManager as any, (s: any) => s);
	const lootSnap: any = useStore(lootTracker as any, (s: any) => s);
	
	const entities: any[] = snapshot?.entities || [];
	const towers = entities.filter((e) => e.type === 'tower');

	const handleUpgrade = (id: number) => {
		const tower = entityManager.getById(id);
		if (!tower) return;
		lootTracker.spendLoot({ type: 'upgrade', payload: { tower } });
	};

	const getTowerColor = (towerName: string) => {
		if (towerName.includes('Fire')) return '#e74c3c';
		if (towerName.includes('Ice')) return '#3498db';
		if (towerName.includes('Poison')) return '#27ae60';
		if (towerName.includes('Thunder')) return '#f1c40f';
		return '#95a5a6';
	};

	const canBuild = qSnap.buildPoints > 0;
	const canUpgrade = qSnap.buildPoints > 0 && lootSnap.collectedLoot >= 35;

	return (
		<div className="tower-panel">
			{towers.map((t) => {
				const isNotBuilt = t.stateName === 'NotBuilt';
				const upgradeLevel = t.upgradeLevel ?? -1;
				const canAct = isNotBuilt ? canBuild : canUpgrade;
				const maxLevel = upgradeLevel >= 2;

				return (
					<div 
						key={t.id} 
						style={{ 
							display: 'flex', 
							flexDirection: 'column',
							alignItems: 'center',
							gap: 4,
							padding: 8,
							borderRadius: 8,
							background: 'rgba(255,255,255,0.05)',
							minWidth: 80
						}}
					>
						<div style={{ 
							width: 40, 
							height: 40, 
							borderRadius: 8,
							background: isNotBuilt ? '#444' : getTowerColor(t.name),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 20,
							border: `2px solid ${isNotBuilt ? '#666' : getTowerColor(t.name)}`
						}}>
							{isNotBuilt ? '🔒' : '🗼'}
						</div>
						
						<div style={{ fontSize: 10, opacity: 0.9, textAlign: 'center' }}>
							{t.name.replace('Tower', '')}
						</div>
						
						{!isNotBuilt && (
							<div style={{ 
								display: 'flex', 
								gap: 2 
							}}>
								{[0, 1, 2].map((lvl) => (
									<div 
										key={lvl}
										style={{
											width: 8,
											height: 8,
											borderRadius: 2,
											background: lvl <= upgradeLevel ? '#f39c12' : '#333',
											border: '1px solid #555'
										}}
									/>
								))}
							</div>
						)}
						
						<button 
							onClick={() => handleUpgrade(t.id)}
							disabled={!canAct || maxLevel}
							style={{
								padding: '4px 8px',
								fontSize: 10,
								background: canAct && !maxLevel
									? 'linear-gradient(45deg, #f39c12, #e67e22)' 
									: '#333',
								border: 'none',
								borderRadius: 4,
								color: '#fff',
								cursor: canAct && !maxLevel ? 'pointer' : 'not-allowed',
								opacity: canAct && !maxLevel ? 1 : 0.5
							}}
						>
							{isNotBuilt ? 'Build' : (maxLevel ? 'Max' : 'Upgrade')}
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default TowerPanel;
