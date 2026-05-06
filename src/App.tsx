import React, { useEffect, useState, useCallback } from 'react';
import { game } from './stores/game';
import { managers } from './stores/managers';
import { screen } from './stores/Screen';
import { soundManager } from './stores/soundManager';
import { lootTracker } from './stores/LootTracker';
import { Vector2 } from './stores/Vector2';
import { cursor } from './stores/Cursor';
import GameArea from './components/GameArea';
import QuestionOverlay from './components/QuestionOverlay';
import StartScreen from './components/StartScreen';
import PauseScreen from './components/PauseScreen';
import WinLoseScreen from './components/WinLoseScreen';
import BackgroundContainer from './components/BackgroundContainer';
import Loot from './components/Loot';
import BuildPoints from './components/BuildPoints';
import TowerChanceIndicator from './components/TowerChanceIndicator';
import Pause from './components/Pause';
import VisualFeedback from './components/VisualFeedback';
import Tutorial from './components/tutorial/Tutorial';
import { getTutorialSeen, setTutorialSeen } from './utils/tutorialStorage';
import './styles.css';

export default function App() {
	const [isStarted, setIsStarted] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [stageResult, setStageResult] = useState<string>('');
	const [stageNumber, setStageNumber] = useState(0);
	const [isQuestionActive, setIsQuestionActive] = useState(false);
	const [preloaded, setPreloaded] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [pendingAutoStart, setPendingAutoStart] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			screen.width = window.innerWidth;
			screen.height = window.innerHeight;
		};
		handleResize();
		window.addEventListener('resize', handleResize);

		soundManager.preload().then(() => {
			setPreloaded(true);
		}).catch(() => {
			setPreloaded(true);
		});

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isStarted) {
				const gameLoop = managers.get('gameLoop');
				if (gameLoop) {
					if (gameLoop.pauseState) {
						gameLoop.resume();
					} else {
						gameLoop.pause();
					}
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isStarted]);

	useEffect(() => {
		let rafId: number;
		let lastIsStarted = game.isStarted;
		let lastIsPaused = false;
		let lastStageResult = '';
		let lastStageNumber = 0;
		let lastIsQuestionActive = false;

		const tick = () => {
			const nextIsStarted = game.isStarted;
			if (nextIsStarted !== lastIsStarted) {
				lastIsStarted = nextIsStarted;
				setIsStarted(nextIsStarted);
			}

			const gameLoop = managers.get('gameLoop');
			const nextIsPaused = !!gameLoop?.pauseState;
			if (nextIsPaused !== lastIsPaused) {
				lastIsPaused = nextIsPaused;
				setIsPaused(nextIsPaused);
			}

			const stageManager = managers.get('stageManager');
			const nextStageResult = stageManager?.stageResult || '';
			if (nextStageResult !== lastStageResult) {
				lastStageResult = nextStageResult;
				setStageResult(nextStageResult);
			}
			const nextStageNumber = stageManager?.stageNumber || 0;
			if (nextStageNumber !== lastStageNumber) {
				lastStageNumber = nextStageNumber;
				setStageNumber(nextStageNumber);
			}

			const questionManager = managers.get('questionManager');
			const nextIsQuestionActive = questionManager?.isActive || false;
			if (nextIsQuestionActive !== lastIsQuestionActive) {
				lastIsQuestionActive = nextIsQuestionActive;
				setIsQuestionActive(nextIsQuestionActive);
			}

			rafId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleGameClick = useCallback((e: React.MouseEvent) => {
		lootTracker.spendLoot({
			type: 'click',
			payload: { offset: new Vector2(e.clientX, e.clientY) }
		});
	}, []);

	const handlePauseClick = useCallback(() => {
		soundManager.play('clickMenu', true);
		const gameLoop = managers.get('gameLoop');
		gameLoop?.pause();
	}, []);

	const handleStart = useCallback(async () => {
		if (!getTutorialSeen()) {
			setPendingAutoStart(true);
			setShowTutorial(true);
			return;
		}
		await game.start();
	}, []);

	const handleOpenTutorial = useCallback(() => {
		setPendingAutoStart(false);
		setShowTutorial(true);
	}, []);

	const handleTutorialComplete = useCallback(async () => {
		setTutorialSeen(true);
		setShowTutorial(false);
		if (pendingAutoStart) {
			setPendingAutoStart(false);
			await game.start();
		}
	}, [pendingAutoStart]);

	const handleRestart = useCallback(() => {
		game.restart();
	}, []);

	const handleResume = useCallback(() => {
		const gameLoop = managers.get('gameLoop');
		gameLoop?.resume();
	}, []);

	if (showTutorial) {
		return <Tutorial onComplete={handleTutorialComplete} />;
	}

	if (!isStarted) {
		return (
			<StartScreen
				onStart={handleStart}
				onOpenTutorial={handleOpenTutorial}
				preloaded={preloaded}
				preloadPercent={soundManager.preloadPercent}
			/>
		);
	}

	if (stageResult) {
		return <WinLoseScreen result={stageResult} onRestart={handleRestart} />;
	}

	if (isPaused) {
		return <PauseScreen onResume={handleResume} onRestart={handleRestart} />;
	}

	return (
		<>
			{preloaded && (
				<div 
					className={`window-wrapper ${isQuestionActive ? 'bullet-time' : ''}`}
					onClick={handleGameClick}
					style={{ cursor: cursor.get('arrow') }}
				>
					<VisualFeedback>
						<div className="wrapper">
							<BackgroundContainer stageNumber={stageNumber} />
							<Loot />
							<BuildPoints />
							<TowerChanceIndicator />
							<button className="btn-pause" onClick={handlePauseClick}>
								<Pause />
							</button>
							<div className="game-container">
								<GameArea />
							</div>
						</div>
					</VisualFeedback>
				</div>
			)}
			<QuestionOverlay />
		</>
	);
}
