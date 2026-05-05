import React, { useEffect, useCallback } from 'react';
import MenuLayout from './MenuLayout';
import Button from './Button';
import { lootTracker } from '../stores/LootTracker';
import { soundManager } from '../stores/soundManager';
import { game } from '../stores/game';
import { resolvePath } from '../utils/paths';

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
				<div className={`winlose-art-container ${result === 'lose' ? 'is-lose' : 'is-win'}`}>
					<img
						src={resolvePath('/enemies/enemies-celebrating.png')}
						alt="Enemies Celebrating"
						className="winlose-art"
					/>
				</div>
				<div className="scores">
					<h2>Enemies killed: {lootTracker.killsEnemy}</h2>
					<h2>Score: {lootTracker.score}</h2>
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
