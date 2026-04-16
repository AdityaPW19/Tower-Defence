import React from 'react';
import { useStore } from '../stores/storeShim';
import { lootTracker } from '../stores/LootTracker';
import { questionManager } from '../stores/QuestionManager';
import { managers } from '../stores/managers';

const LootHUD: React.FC = () => {
	const snap: any = useStore(lootTracker as any, (s: any) => s);
	const qSnap: any = useStore(questionManager as any, (s: any) => s);

	const stageManager = managers.get('stageManager');
	const stageNumber = stageManager?.stageNumber ?? 0;

	return (
		<div className="loot-hud">
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<span style={{ fontSize: 24 }}>💰</span>
				<div>
					<div style={{ fontSize: 20, fontWeight: 'bold', color: '#f39c12' }}>
						{snap.collectedLoot}
					</div>
					<div style={{ fontSize: 10, opacity: 0.7 }}>Gold</div>
				</div>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<span style={{ fontSize: 24 }}>🔧</span>
				<div>
					<div style={{ fontSize: 20, fontWeight: 'bold', color: '#3498db' }}>
						{qSnap.buildPoints}
					</div>
					<div style={{ fontSize: 10, opacity: 0.7 }}>Build Points</div>
				</div>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<span style={{ fontSize: 24 }}>⚔️</span>
				<div>
					<div style={{ fontSize: 20, fontWeight: 'bold', color: '#e74c3c' }}>
						{snap.killsEnemy}
					</div>
					<div style={{ fontSize: 10, opacity: 0.7 }}>Kills</div>
				</div>
			</div>

			<div style={{ 
				borderTop: '1px solid rgba(255,255,255,0.1)', 
				paddingTop: 8,
				marginTop: 4
			}}>
				<div style={{ fontSize: 12, opacity: 0.7 }}>
					Stage {stageNumber + 1}
				</div>
			</div>
		</div>
	);
};

export default LootHUD;
