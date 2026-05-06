import React, { useCallback, useEffect, useState } from 'react';
import { soundManager } from '../../stores/soundManager';
import MockBoard, { type TowerSpotId } from './MockBoard';
import MockEnemy from './MockEnemy';
import StepCastleHighlight from './StepCastleHighlight';
import FingerCursor from './FingerCursor';
import StepCard from './StepCard';
import MascotMoment from './MascotMoment';
import MockQuestion from './MockQuestion';
import TutorialStep6Build from './TutorialStep6Build';
import '../../styles/tutorial.css';

interface TutorialProps {
	onComplete: () => void;
	onSkip?: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 8 = final "You're ready" card

const TOTAL_STEPS = 7;

const Tutorial: React.FC<TutorialProps> = ({ onComplete, onSkip }) => {
	const [step, setStep] = useState<Step>(1);
	const [step6BuiltSpot, setStep6BuiltSpot] = useState<TowerSpotId | null>(null);
	const [killedEnemy, setKilledEnemy] = useState(false);
	const [burst, setBurst] = useState<{ left: string; top: string; key: number } | null>(null);
	const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);

	const next = useCallback(() => {
		soundManager.play('clickMenu', true);
		setStep(s => (s + 1) as Step);
	}, []);

	const openSkipConfirm = useCallback(() => {
		soundManager.play('clickMenu', true);
		setSkipConfirmOpen(true);
	}, []);

	const closeSkipConfirm = useCallback(() => {
		soundManager.play('clickMenu', true);
		setSkipConfirmOpen(false);
	}, []);

	const confirmSkipTutorial = useCallback(() => {
		soundManager.play('clickMenu', true);
		setSkipConfirmOpen(false);
		(onSkip || onComplete)();
	}, [onSkip, onComplete]);

	useEffect(() => {
		if (!skipConfirmOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				closeSkipConfirm();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [skipConfirmOpen, closeSkipConfirm]);

	const handleFinalCta = useCallback(() => {
		soundManager.play('clickMenu', true);
		onComplete();
	}, [onComplete]);

	const handleEnemyTap = useCallback((e: React.MouseEvent) => {
		if (killedEnemy) return;
		setKilledEnemy(true);
		soundManager.play('clickEnemy');
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		setBurst({
			left: `${rect.left + rect.width / 2}px`,
			top: `${rect.top + rect.height / 2}px`,
			key: Date.now()
		});
		setTimeout(() => setStep(4), 450);
	}, [killedEnemy]);

	const showBoard = step >= 1 && step <= 3;
	const showSpotlight = step >= 1 && step <= 3;
	const showBackdrop = step >= 1 && step <= 3;

	// Finger cursor positions per step (relative to the viewport).
	const renderFinger = () => {
		if (step === 1) {
			return <FingerCursor left="64%" top="40%" />;
		}
		// if (step === 2) {
		// 	return <FingerCursor left="34%" top="34%" />;
		// }
		if (step === 3 && !killedEnemy) {
			/* Enemy ~18%/42%: hand sits above and a bit right so the tip aims down-left at the sprite */
			return <FingerCursor left="28%" top="38%" />;
		}
		return null;
	};

	return (
		<div className="tut-root">
			<div className="grid-overlay" />
			<div className="scan-line" />

			<button
				className="tut-skip"
				onClick={openSkipConfirm}
				type="button"
				aria-label="Skip tutorial"
				aria-expanded={skipConfirmOpen}
				aria-haspopup="dialog"
			>
				Skip
			</button>

			{skipConfirmOpen && (
				<div
					className="tut-skip-confirm-backdrop"
					role="presentation"
					onClick={closeSkipConfirm}
				>
					<div
						className="tut-skip-confirm-dialog"
						role="dialog"
						aria-modal="true"
						aria-labelledby="tut-skip-confirm-title"
						aria-describedby="tut-skip-confirm-desc"
						onClick={e => e.stopPropagation()}
					>
						<h2 id="tut-skip-confirm-title" className="tut-skip-confirm-title">
							Are you sure?
						</h2>
						<p id="tut-skip-confirm-desc" className="tut-skip-confirm-message">
							You can always replay the tutorial from the main menu.
						</p>
						<div className="tut-skip-confirm-actions">
							<button
								className="tut-skip-confirm-btn tut-skip-confirm-btn--no"
								onClick={closeSkipConfirm}
								type="button"
							>
								No
							</button>
							<button
								className="tut-skip-confirm-btn tut-skip-confirm-btn--yes tut-cta"
								onClick={confirmSkipTutorial}
								type="button"
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Mock board: steps 1–3 / 7–8 — step 6 uses its own board inside TutorialStep6Build */}
			{(showBoard || step === 7 || step === 8) && (
				<MockBoard
					useCastleArt
					omitCenterCastle={step >= 1 && step <= 3}
					builtSpot={step >= 7 ? step6BuiltSpot : null}
					highlightTowers={false}
				/>
			)}

			{showBackdrop && <div className="tut-backdrop" />}

			{showSpotlight && <StepCastleHighlight />}

			{/* Step 2: enemies coming from edges */}
			{step === 2 && (
				<>
					<MockEnemy left="14%" top="22%" variant="purple" frame={0} delay={0} />
					<MockEnemy left="86%" top="28%" variant="yellow" frame={1} delay={150} />
					<MockEnemy left="20%" top="74%" variant="blue" frame={2} delay={300} />
					<MockEnemy left="82%" top="78%" variant="purple" frame={3} delay={450} />
				</>
			)}

			{/* Step 3: enemy above backdrop + spotlight; farther from castle; tap only advances */}
			{step === 3 && (
				<MockEnemy
					left="18%"
					top="42%"
					variant="purple"
					frame={1}
					delay={0}
					clickable={!killedEnemy}
					killed={killedEnemy}
					glow={!killedEnemy}
					aboveSpotlight
					onClick={handleEnemyTap}
				/>
			)}

			{burst && step === 3 && (
				<div
					className="tut-burst"
					key={burst.key}
					style={{ left: burst.left, top: burst.top }}
				/>
			)}

			{renderFinger()}

			{/* Step UI */}
			{step === 1 && (
				<StepCard
					stepNumber={1}
					totalSteps={TOTAL_STEPS}
					title="Protect the castle."
					subtitle="If enemies reach it, health goes down."
					ctaText="Next"
					onCta={next}
				/>
			)}

			{step === 2 && (
				<StepCard
					stepNumber={2}
					totalSteps={TOTAL_STEPS}
					title="Enemies can appear from anywhere."
					subtitle="If enemies reach the castle, health goes down."
					ctaText="Next"
					onCta={next}
				/>
			)}

			{step === 3 && (
				<StepCard
					stepNumber={3}
					totalSteps={TOTAL_STEPS}
					title="Tap to kill enemies."
					subtitle="But it costs 5 coins."
				/>
			)}

			{step === 4 && <MascotMoment onContinue={next} />}

			{step === 5 && <MockQuestion onAnswered={next} />}

			{step === 6 && (
				<TutorialStep6Build
					onBuiltSpot={setStep6BuiltSpot}
					onComplete={next}
					totalSteps={TOTAL_STEPS}
				/>
			)}

			{step === 7 && (
				<StepCard
					stepNumber={7}
					totalSteps={TOTAL_STEPS}
					title="If 3 STRIKES!"
					subtitle="One built tower is lost."
					ctaText="Next"
					onCta={next}
				>
					<div className="tut-strikes" aria-hidden="true">
						<div className="tut-strike-dot" />
						<div className="tut-strike-dot" />
						<div className="tut-strike-dot" />
					</div>
				</StepCard>
			)}

			{step === 8 && (
				<StepCard
					title="You're ready!"
					subtitle="Protect the castle and build smart."
					variant="final"
					ctaText="Let's Go!"
					onCta={handleFinalCta}
				/>
			)}
		</div>
	);
};

export default Tutorial;
