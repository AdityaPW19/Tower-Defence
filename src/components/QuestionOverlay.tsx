import React, { useState, useEffect, useRef, useCallback } from 'react';
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
		let lastIsActive: boolean | null = null;
		let lastQuestion: any = null;
		let lastStrikes = -1;
		let lastProgress = -1;

		const tick = () => {
			const qm = managers.get('questionManager');
			if (qm) {
				if (qm.isActive !== lastIsActive) {
					lastIsActive = qm.isActive;
					setIsActive(qm.isActive);
				}
				if (qm.currentQuestion !== lastQuestion) {
					lastQuestion = qm.currentQuestion;
					setCurrentQuestion(qm.currentQuestion);
				}
				if (qm.strikes !== lastStrikes) {
					lastStrikes = qm.strikes;
					setStrikes(qm.strikes);
				}
				if (qm.initialTimer > 0) {
					const nextProgress = (qm.timer / qm.initialTimer) * 100;
					const rounded = Math.round(nextProgress * 10) / 10;
					if (rounded !== lastProgress) {
						lastProgress = rounded;
						setProgress(rounded);
					}
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

	const handleAnswer = useCallback((index: number) => {
		soundManager.play('clickMenu', true);
		const qm = managers.get('questionManager');
		qm?.answer(index);
	}, []);

	const toggleHint = useCallback(() => {
		soundManager.play('clickMenu', true);
		setShowHint(prev => !prev);
	}, []);

	const handleVideoCanPlay = useCallback(() => {
		setVideoLoaded(true);
	}, []);

	if (!isActive || !currentQuestion) return null;

	const isDangerTime = progress < 30;
	const timerBackground = isDangerTime
		? '#ff3333'
		: 'linear-gradient(90deg, #d685da 0%, #ff7a3d 100%)';
	const timerShadowColor = isDangerTime ? '#ff3333' : '#ff7a3d';
	const qm = managers.get('questionManager');
	const secondsRemaining = qm && qm.timer > 0 ? Math.ceil(qm.timer / 1000) : 0;

	const hintText: string = typeof currentQuestion.hint === 'string' ? currentQuestion.hint.trim() : '';
	const hasHintText = hintText.length > 0 && hintText.toLowerCase() !== 'none';
	const hasHintImage = !!currentQuestion.hintImage;
	const hasHint = hasHintText || hasHintImage;

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
							<div className="question-title-pill">
								<h2 className="question-title">- Incoming Transmission -</h2>
							</div>
							<div className="timer-row">
								<span className="timer-label">
									<span className="timer-bullet" />
									Time Transmission
								</span>
								<div className="timer-container">
									<div
										className="timer-bar"
										style={{
											width: `${progress}%`,
											background: timerBackground,
											boxShadow: `0 0 10px ${timerShadowColor}`,
											transition: 'width 0.4s cubic-bezier(0.33, 1, 0.68, 1)'
										}}
									/>
								</div>
								<span className="timer-seconds">{secondsRemaining}s</span>
							</div>
						</div>

						<div className="question-scroll-area">
							<div className="question-box">
								<span className="question-corner question-corner-tl" />
								<span className="question-corner question-corner-tr" />
								<span className="question-corner question-corner-bl" />
								<span className="question-corner question-corner-br" />

								{currentQuestion.question && (
									<p className="question-text">{currentQuestion.question}</p>
								)}

								{currentQuestion.image && (
									<div className="question-image-container">
										<img src={currentQuestion.image} alt="Question" className="question-img" />
									</div>
								)}
							</div>

							{currentQuestion.meta && (
								<div className="meta-tags">
									<div className="meta-tag meta-tag-level">
										<span className="meta-label">Level:</span>
										<span className="meta-value">{currentQuestion.meta.level || '1'}</span>
									</div>
									<div className="meta-tag meta-tag-category">
										<span className="meta-label">Category:</span>
										<span className="meta-value">{currentQuestion.meta.subject || 'Unknown'}</span>
									</div>
								</div>
							)}

							{hasHint && (
								<div className="hint-section">
									<button className="hint-toggle-btn" onClick={toggleHint}>
										<span className="hint-icon">?</span>
										{showHint ? 'Hide Data Fragment' : 'Decrypt Data Fragment (Hint)'}
									</button>

									{showHint && (
										<div className="hint-content">
											{hasHintText && <p className="hint-text">{hintText}</p>}
											{hasHintImage && (
												<div className="hint-image-container">
													<img src={currentQuestion.hintImage} alt="Hint" className="hint-img" />
												</div>
											)}
										</div>
									)}
								</div>
							)}

							<div className={`options-grid ${currentQuestion.options?.some((o: any) => o.image) ? 'has-images' : ''}`}>
								{currentQuestion.options?.map((option: any, index: number) => (
									<button
										key={index}
										className={`sci-fi-btn ${option.image ? 'image-btn' : ''}`}
										onClick={() => handleAnswer(index)}
										style={{ cursor: cursor.get('arrow') }}
									>
										<span className="option-bullet" />
										<div className="option-content">
											{option.image && <img src={option.image} alt={`Option ${index + 1}`} className="option-img" />}
											{option.text && <span className="btn-text">{option.text}</span>}
										</div>
									</button>
								))}
							</div>
						</div>

						<div className="question-footer">
							<div className="footer-warning">
								<span className="warning-icon" aria-hidden="true">
									<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
										<line x1="12" y1="9" x2="12" y2="13" />
										<line x1="12" y1="17" x2="12.01" y2="17" />
									</svg>
								</span>
								<span className="warning-text">3 strikes = tower lost</span>
							</div>
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
