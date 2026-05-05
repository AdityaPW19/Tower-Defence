import React, { useState, useEffect } from 'react';
import MenuLayout from './MenuLayout';
import Button from './Button';
import { soundManager } from '../stores/soundManager';
import { game } from '../stores/game';
import { resolvePath } from '../utils/paths';

interface PauseScreenProps {
	onResume: () => void;
	onRestart: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onRestart }) => {
	const [showExitConfirmation, setShowExitConfirmation] = useState(false);
	const [isMuted, setIsMuted] = useState(soundManager.isMuted);

	useEffect(() => {
		soundManager.reduceBgVolume();
		return () => {
			soundManager.restoreBgVolume();
		};
	}, []);

	const toggleMute = () => {
		soundManager.toggleMute();
		setIsMuted(soundManager.isMuted);
	};

	const confirmExit = async () => {
		if (game.cleanup) {
			await game.cleanup();
		} else {
			game.isStarted = false;
		}
		setShowExitConfirmation(false);
	};

	return (
		<div className="pause-overlay">
			<button 
				className="sound-toggle" 
				onClick={toggleMute}
				aria-label={isMuted ? "Unmute" : "Mute"}
				title={isMuted ? "Unmute" : "Mute"}
			>
				{!isMuted ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
						<path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-4 0h-2.5l-5 5H1.5v7.5h5l5 5v-17.5zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
						<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
					</svg>
				)}
			</button>

			<MenuLayout>
				<div className="pause-content">
					<div className="pause-title">
						<h1>Paused</h1>
					</div>
					<div className="pause-art-container">
						<img
							src={resolvePath('/enemies/enemies-planning.png')}
							alt="Enemies Planning"
							className="pause-art"
						/>
					</div>
					<div className="buttons-container">
						<Button text="Resume Game" onClick={onResume} />
						<Button text="Restart Game" onClick={onRestart} />
						<Button text="Exit to Menu" onClick={() => setShowExitConfirmation(true)} />
					</div>
				</div>
			</MenuLayout>

			{showExitConfirmation && (
				<div className="confirm-overlay">
					<div className="confirm-backdrop" />
					<div className="confirm-box">
						<div className="confirm-headers">
							<h2 className="confirm-title">Exit Protocol</h2>
							<div className="decoration-bar" />
						</div>
						<div className="confirm-body">
							<p>Are you sure you want to abort mission?</p>
							<p className="warning">Current progress will be lost.</p>
						</div>
						<div className="confirm-actions">
							<Button text="Yes" onClick={confirmExit} />
							<Button text="No" onClick={() => setShowExitConfirmation(false)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PauseScreen;
