import React, { useState, useEffect, useRef } from 'react';
import { managers } from '../stores/managers';
import { soundManager } from '../stores/soundManager';
import { cursor } from '../stores/Cursor';
import { resolvePath } from '../utils/paths';

const QuestionOverlay: React.FC = () => {
	const [isActive, setIsActive] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState<any>(null);
	const [progress, setProgress] = useState(100);
	const [strikes, setStrikes] = useState(0);
	const [animationPhase, setAnimationPhase] = useState<'idle' | 'incoming' | 'impact' | 'active'>('idle');
	const [showHint, setShowHint] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const prevIsActiveRef = useRef(false);

	useEffect(() => {
		let rafId: number;
		const tick = () => {
			const qm = managers.get('questionManager');
			if (qm) {
				setIsActive(qm.isActive);
				setCurrentQuestion(qm.currentQuestion);
				setStrikes(qm.strikes);
				if (qm.initialTimer > 0) {
					setProgress((qm.timer / qm.initialTimer) * 100);
				}
			}
			rafId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	useEffect(() => {
		if (isActive && currentQuestion && animationPhase === 'idle') {
			setAnimationPhase('incoming');
			setVideoLoaded(false);
			setShowHint(false);
			soundManager.play('shine');

			setTimeout(() => {
				setAnimationPhase('impact');
				soundManager.play('magicBurst');
			}, 1600);

			setTimeout(() => {
				setAnimationPhase('active');
			}, 1900);
		} else if (!isActive && prevIsActiveRef.current) {
			setAnimationPhase('idle');
			setShowHint(false);
		}
		prevIsActiveRef.current = isActive;
	}, [isActive, currentQuestion, animationPhase]);

	const handleAnswer = (index: number) => {
		soundManager.play('clickMenu', true);
		const qm = managers.get('questionManager');
		qm?.answer(index);
	};

	const toggleHint = () => {
		soundManager.play('clickMenu', true);
		setShowHint(!showHint);
	};

	const handleVideoCanPlay = () => {
		setVideoLoaded(true);
	};

	if (!isActive || !currentQuestion) return null;

	const timerColor = progress < 30 ? '#ff3333' : '#d685da';

	return (
		<div className="question-overlay">
			<div className="question-backdrop" />

			{(animationPhase === 'incoming' || animationPhase === 'impact') && (
				<div className="video-container">
					<video
						ref={videoRef}
						src={resolvePath('/videos/star-video.mp4')}
						autoPlay
						muted
						playsInline
						className={`star-video ${videoLoaded ? 'visible' : ''}`}
						onCanPlay={handleVideoCanPlay}
					>
						<track kind="captions" />
					</video>
				</div>
			)}

			{animationPhase === 'active' && (
				<div className="question-hud">
					<div className="question-content">
						<div className="question-header">
							<h2 className="question-title">Incoming Transmission</h2>
							<div className="timer-container">
								<div 
									className="timer-bar" 
									style={{ 
										width: `${progress}%`,
										background: timerColor,
										boxShadow: `0 0 10px ${timerColor}`,
										transition: 'width 0.4s cubic-bezier(0.33, 1, 0.68, 1)'
									}} 
								/>
							</div>
						</div>

						<div className="question-scroll-area">
							<div className="question-box">
								{currentQuestion.question && (
									<p className="question-text">{currentQuestion.question}</p>
								)}

								{currentQuestion.image && (
									<div className="question-image-container">
										<img src={currentQuestion.image} alt="Question" className="question-img" />
									</div>
								)}

								{currentQuestion.meta && (
									<div className="meta-tag">
										<span className="meta-label">Subject:</span> {currentQuestion.meta.subject || 'Unknown'}
										<span className="meta-separator">|</span>
										<span className="meta-label">Level:</span> {currentQuestion.meta.level || '1'}
									</div>
								)}

								{(currentQuestion.hint || currentQuestion.hintImage) && (
									<div className="hint-section">
										<button className="hint-toggle-btn" onClick={toggleHint}>
											<span className="hint-icon">?</span>
											{showHint ? 'Hide Data Fragment' : 'Decrypt Data Fragment (Hint)'}
										</button>
										
										{showHint && (
											<div className="hint-content">
												{currentQuestion.hint && <p className="hint-text">{currentQuestion.hint}</p>}
												{currentQuestion.hintImage && (
													<div className="hint-image-container">
														<img src={currentQuestion.hintImage} alt="Hint" className="hint-img" />
													</div>
												)}
											</div>
										)}
									</div>
								)}
							</div>

							<div className={`options-grid ${currentQuestion.options?.some((o: any) => o.image) ? 'has-images' : ''}`}>
								{currentQuestion.options?.map((option: any, index: number) => (
									<button
										key={index}
										className={`sci-fi-btn ${option.image ? 'image-btn' : ''}`}
										onClick={() => handleAnswer(index)}
										style={{ cursor: cursor.get('arrow') }}
									>
										<div className="option-content">
											{option.image && <img src={option.image} alt={`Option ${index + 1}`} className="option-img" />}
											{option.text && <span className="btn-text">{option.text}</span>}
										</div>
									</button>
								))}
							</div>
						</div>

						<div className="question-footer">
							<div className="status-indicator">
								<span className="status-label">Strikes</span>
								<div className="strikes-container">
									{[0, 1, 2].map(i => (
										<div key={i} className={`strike-dot ${i < strikes ? 'active' : ''}`} />
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default QuestionOverlay;
