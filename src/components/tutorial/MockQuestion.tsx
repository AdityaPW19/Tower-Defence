import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Bg1 from '../backgrounds/Bg1';
import { resolvePath } from '../../utils/paths';
import { soundManager } from '../../stores/soundManager';
import StepCard from './StepCard';
import FingerCursor from './FingerCursor';

interface MockQuestionProps {
	onAnswered: () => void;
}

type Phase = 'incoming' | 'impact' | 'banner' | 'question';

type GuideStep = 1 | 2 | 3;

const TIMER_DURATION_MS = 18000;

const EXAMPLE_QUESTION = {
	question: 'Which planet is known as the Red Planet?',
	options: [
		{ text: 'Earth' },
		{ text: 'Mars' },
		{ text: 'Jupiter' },
		{ text: 'Venus' }
	],
	meta: { subject: 'Astronomy', level: 'Easy' }
};

/** Index of Mars in `EXAMPLE_QUESTION.options` — only this choice exits the guided step */
const CORRECT_OPTION_INDEX = 1;

const MockQuestion: React.FC<MockQuestionProps> = ({ onAnswered }) => {
	const [phase, setPhase] = useState<Phase>('incoming');
	const [guideStep, setGuideStep] = useState<GuideStep>(1);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [progress, setProgress] = useState(100);
	const [fingerPos, setFingerPos] = useState<{ left: number; top: number } | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const answeredRef = useRef(false);
	const correctBtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		soundManager.play('shine');

		const t1 = setTimeout(() => {
			setPhase('impact');
			soundManager.play('magicBurst');
		}, 1500);

		const t2 = setTimeout(() => {
			setPhase('banner');
		}, 1900);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);

	/* Guided answer phase: countdown only after substep 3 begins */
	useEffect(() => {
		if (phase !== 'question' || guideStep !== 3) return;
		answeredRef.current = false;
		setProgress(100);
		const duration = TIMER_DURATION_MS;
		const start = performance.now();
		let raf = 0;
		const tick = () => {
			const elapsed = performance.now() - start;
			const pct = Math.max(0, 100 - (elapsed / duration) * 100);
			setProgress(pct);
			if (pct <= 0) {
				if (!answeredRef.current) {
					answeredRef.current = true;
					onAnswered();
				}
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [phase, guideStep, onAnswered]);

	const updateFingerRect = useCallback(() => {
		if (phase !== 'question' || guideStep !== 3) {
			setFingerPos(null);
			return;
		}
		const el = correctBtnRef.current;
		if (!el) {
			setFingerPos(null);
			return;
		}
		const r = el.getBoundingClientRect();
		/* Aim tip toward center-right of Mars button — fixed to viewport like gameplay hints */
		setFingerPos({ left: r.right - r.width * 0.06, top: r.top + r.height * 0.22 });
	}, [phase, guideStep]);

	useLayoutEffect(() => {
		updateFingerRect();
		window.addEventListener('resize', updateFingerRect);
		window.addEventListener('scroll', updateFingerRect, true);
		return () => {
			window.removeEventListener('resize', updateFingerRect);
			window.removeEventListener('scroll', updateFingerRect, true);
		};
	}, [updateFingerRect]);

	const handleVideoCanPlay = useCallback(() => setVideoLoaded(true), []);

	const handleLetsGoToQuestion = useCallback(() => {
		soundManager.play('clickMenu', true);
		setGuideStep(1);
		setPhase('question');
	}, []);

	const advanceGuide = useCallback(() => {
		soundManager.play('clickMenu', true);
		setGuideStep(s => (s === 1 ? 2 : s === 2 ? 3 : s));
	}, []);

	const handleOptionClick = useCallback(
		(index: number) => {
			if (phase !== 'question' || guideStep !== 3) return;
			if (answeredRef.current) return;
			if (index !== CORRECT_OPTION_INDEX) {
				soundManager.play('lowResourse', true);
				return;
			}
			answeredRef.current = true;
			soundManager.play('clickMenu', true);
			onAnswered();
		},
		[phase, guideStep, onAnswered]
	);

	const isVideoVisible = phase === 'incoming' || phase === 'impact';
	const showFlash = phase === 'impact';
	const isDangerTime = progress < 30;
	const timerBackground = isDangerTime
		? '#ff3333'
		: 'linear-gradient(90deg, #d685da 0%, #ff7a3d 100%)';
	const timerShadowColor = isDangerTime ? '#ff3333' : '#ff7a3d';
	const secondsRemaining =
		guideStep === 3 ? Math.max(0, Math.ceil((progress / 100) * (TIMER_DURATION_MS / 1000))) : 18;
	const timerBarActive = guideStep === 3;

	return (
		<>
			{isVideoVisible && (
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
					<div className={`tut-video-flash ${showFlash ? 'tut-flash' : ''}`} />
				</div>
			)}

			{phase === 'banner' && (
				<div className="tut-step5-banner-screen" role="dialog" aria-labelledby="tut-step5-title" aria-describedby="tut-step5-desc">
					<div className="tut-mascot-bg" aria-hidden="true">
						<Bg1 />
					</div>
					<div className="tut-step5-banner-foreground">
						<div className="tut-step5-title-banner">
							<h1 id="tut-step5-title" className="tut-step5-title">
								The Message of the Stars
							</h1>
							<p id="tut-step5-desc" className="tut-step5-sub">
								Decrypt the transmit to earn build points
							</p>
							<button className="tut-cta tut-step5-banner-cta" type="button" onClick={handleLetsGoToQuestion}>
								Let&apos;s Go
							</button>
						</div>
					</div>
				</div>
			)}

			{phase === 'question' && (
				<>
					<div
						className={[
							'tut-question-overlay',
							'tut-mock-q-guided',
							'question-overlay',
							guideStep === 1 ? 'tut-mock-q-guide-step-1' : '',
							guideStep === 2 ? 'tut-mock-q-guide-step-2' : ''
						]
							.filter(Boolean)
							.join(' ')}
					>
						<div className="question-backdrop" />
						<div className="question-hud">
							<div className="question-content">
								<div className="question-header">
									<div className="question-title-pill">
										<h2 className="question-title">- Incoming Transmission -</h2>
									</div>
									<div className={`timer-row ${guideStep === 2 ? 'tut-mock-guide-target' : ''}`}>
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
													boxShadow: timerBarActive ? `0 0 10px ${timerShadowColor}` : undefined,
													transition: timerBarActive ? undefined : 'width 0s'
												}}
											/>
										</div>
										<span className="timer-seconds">{secondsRemaining}s</span>
									</div>
								</div>

								<div className="question-scroll-area">
									<div className={`question-box ${guideStep === 1 ? 'tut-mock-guide-target' : ''}`}>
										<span className="question-corner question-corner-tl" />
										<span className="question-corner question-corner-tr" />
										<span className="question-corner question-corner-bl" />
										<span className="question-corner question-corner-br" />
										<p className="question-text">{EXAMPLE_QUESTION.question}</p>
										<span className="tut-example-tag">Example question</span>
									</div>

									<div className={`meta-tags ${guideStep === 3 ? 'tut-mock-q-meta-muted' : ''}`}>
										<div className="meta-tag meta-tag-level">
											<span className="meta-label">Level:</span>
											<span className="meta-value">{EXAMPLE_QUESTION.meta.level}</span>
										</div>
										<div className="meta-tag meta-tag-category">
											<span className="meta-label">Category:</span>
											<span className="meta-value">{EXAMPLE_QUESTION.meta.subject}</span>
										</div>
									</div>

									<div className={`options-grid ${guideStep === 3 ? 'tut-mock-q-options-focus' : ''}`}>
										{EXAMPLE_QUESTION.options.map((opt, i) => (
											<button
												key={i}
												ref={i === CORRECT_OPTION_INDEX ? correctBtnRef : undefined}
												type="button"
												className={
													i === CORRECT_OPTION_INDEX && guideStep === 3 ? 'sci-fi-btn tut-mock-guide-target' : 'sci-fi-btn'
												}
												onClick={() => handleOptionClick(i)}
												disabled={guideStep !== 3}
												tabIndex={guideStep !== 3 ? -1 : 0}
											>
												<span className="option-bullet" />
												<div className="option-content">
													<span className="btn-text">{opt.text}</span>
												</div>
											</button>
										))}
									</div>
								</div>

								<div className={`question-footer ${guideStep === 3 ? 'tut-mock-q-footer-muted' : ''}`}>
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
											{[0, 1, 2].map(j => (
												<div key={j} className="strike-dot" />
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{guideStep < 3 && <div className="tut-mock-q-input-block" aria-hidden="true" />}

					{guideStep === 1 && (
						<StepCard
							className="tut-mock-q-guide-card"
							title="This is the question."
							subtitle="Read what the stars are asking you."
							ctaText="Next"
							onCta={advanceGuide}
						/>
					)}

					{guideStep === 2 && (
						<StepCard
							className="tut-mock-q-guide-card"
							title="Answer before the timer runs out."
							subtitle="When you continue, time starts ticking."
							ctaText="Next"
							onCta={advanceGuide}
						/>
					)}

					{fingerPos && guideStep === 3 && (
						<FingerCursor
							className="tut-mock-q-finger"
							left={fingerPos.left}
							top={fingerPos.top}
							style={{ position: 'fixed' }}
						/>
					)}
				</>
			)}
		</>
	);
};

export default MockQuestion;
