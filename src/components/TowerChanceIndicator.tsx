import React, { useState, useEffect, useRef } from 'react';
import { managers } from '../stores/managers';
import { GameConfig } from '../config/gameConfig';
import BlinkingStar from './BlinkingStar';

const TowerChanceIndicator: React.FC = () => {
	const [progress, setProgress] = useState(0);
	const [points, setPoints] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [isQuestionActive, setIsQuestionActive] = useState(false);
	const [pointAnim, setPointAnim] = useState(false);
	const [starVisible, setStarVisible] = useState(false);
	const [starPosition, setStarPosition] = useState({ x: 50, y: 50 });
	
	const prevPointsRef = useRef(0);
	const hasTriggeredStarRef = useRef(false);

	useEffect(() => {
		let rafId: number;
		let lastProgress = -1;
		let lastPoints = -1;
		let lastIsQuestionActive: boolean | null = null;
		let lastIsGameOver: boolean | null = null;

		const tick = () => {
			const questionManager = managers.get('questionManager');
			const stageManager = managers.get('stageManager');

			if (questionManager) {
				const newProgress = Math.min(100, (questionManager.gameTimeSinceLastQuestion / GameConfig.questionInterval) * 100);
				const roundedProgress = Math.round(newProgress * 10) / 10;
				if (roundedProgress !== lastProgress) {
					lastProgress = roundedProgress;
					setProgress(roundedProgress);
				}

				const nextPoints = questionManager.buildPoints || 0;
				if (nextPoints !== lastPoints) {
					lastPoints = nextPoints;
					setPoints(nextPoints);
				}

				if (questionManager.isActive !== lastIsQuestionActive) {
					lastIsQuestionActive = questionManager.isActive;
					setIsQuestionActive(questionManager.isActive);
				}

				if (newProgress >= 92 && !hasTriggeredStarRef.current && !questionManager.isActive) {
					hasTriggeredStarRef.current = true;
					setStarVisible(true);
					setStarPosition({
						x: 15 + Math.random() * 70,
						y: 15 + Math.random() * 70
					});
				}

				if (newProgress < 50) {
					if (hasTriggeredStarRef.current) {
						hasTriggeredStarRef.current = false;
						setStarVisible(false);
					}
				}

				if (questionManager.buildPoints > prevPointsRef.current) {
					setPointAnim(true);
					setTimeout(() => setPointAnim(false), 1500);
				}
				prevPointsRef.current = questionManager.buildPoints;
			}

			if (stageManager) {
				const nextGameOver = !!stageManager.stageResult;
				if (nextGameOver !== lastIsGameOver) {
					lastIsGameOver = nextGameOver;
					setIsGameOver(nextGameOver);
				}
			}

			rafId = requestAnimationFrame(tick);
		};

		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	if (isQuestionActive || isGameOver) return null;

	return (
		<>
			{starVisible && <BlinkingStar x={starPosition.x} y={starPosition.y} />}
			<div className="indicator-container">
				<div className="timer-section">
					<div className="label-row">
						<span className="label">Star Transmit</span>
					</div>
					<div className="bar-row">
						<div className="progress-bar-bg">
							<div className="progress-bar-fill" style={{ width: `${progress}%` }} />
						</div>
						<span className="status-text">{Math.floor(progress)}%</span>
					</div>
				</div>

				{points > 0 && (
					<div className={`points-badge has-points`}>
						<div className="badge-content">
							<span className="icon">🛠️</span>
							<span className="count">{points}</span>
							<div className="text">
								<span>Builds</span>
								<small>Available</small>
							</div>
						</div>
						{pointAnim && <div className="floating-text">+1 BP</div>}
					</div>
				)}
			</div>
		</>
	);
};

export default TowerChanceIndicator;
