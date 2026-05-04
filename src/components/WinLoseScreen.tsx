import React, { useEffect, useCallback } from 'react';
import MenuLayout from './MenuLayout';
import Button from './Button';
import { lootTracker } from '../stores/LootTracker';
import { soundManager } from '../stores/soundManager';
import { game } from '../stores/game';
import LootIcon from './LootIcon';

interface WinLoseScreenProps {
	result: 'win' | 'lose';
	onRestart: () => void;
}

const WinLoseScreen: React.FC<WinLoseScreenProps> = ({ result, onRestart }) => {
	useEffect(() => {
		soundManager.reduceBgVolume();
		return () => {
			soundManager.restoreBgVolume();
		};
	}, []);

	const handleExit = useCallback(async () => {
		soundManager.play('clickMenu', true);
		if (game.cleanup) {
			await game.cleanup();
		} else {
			game.isStarted = false;
		}
	}, []);

	return (
		<MenuLayout>
			<div className="winlose-content">
				<h1>{result === 'win' ? 'You win!' : 'You lose!'}</h1>
				<div className="scores">
					<h2>Enemies killed: {lootTracker.killsEnemy}</h2>
					<h2>Score: {lootTracker.score}</h2>
				</div>
				<div className="hint">
					<h2>Hint:</h2>
					<p>- Click on an Enemy to kill it</p>
					<p>- Click on a gray spot to build a Tower</p>
					<p>- Click on a Tower to upgrade</p>
					<div className="additional-hint">
						<div>Manage your resources carefully if you want to survive until the last wave!</div>
						<div className="cost">
							<div className="cost-item">
								<div>Upgrading towers costs 35</div>
								<div>
									<LootIcon width={13} height={13} />
								</div>
							</div>
							<div className="cost-item">
								<div>Enemy click costs 5</div>
								<div>
									<LootIcon width={13} height={13} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="buttons-container">
					<Button onClick={onRestart} text="Restart" />
					<Button onClick={handleExit} text="Exit to Menu" />
				</div>
			</div>
		</MenuLayout>
	);
};

export default WinLoseScreen;
