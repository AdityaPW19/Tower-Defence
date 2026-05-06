import React, { useEffect, useRef, useState } from 'react';
import Bg1 from '../backgrounds/Bg1';
import TutorialTransmitStar from './TutorialTransmitStar';
import { resolvePath } from '../../utils/paths';
import { soundManager } from '../../stores/soundManager';

interface MascotMomentProps {
	onContinue: () => void;
}

const FULL_TEXT = 'There is a smarter way to kill them.';

const BAR_FILL_DURATION_MS = 2200;

const MascotMoment: React.FC<MascotMomentProps> = ({ onContinue }) => {
	const [typed, setTyped] = useState('');
	const [textDone, setTextDone] = useState(false);
	const [barPct, setBarPct] = useState(0);
	const [showTransmitStar, setShowTransmitStar] = useState(false);
	const [showCta, setShowCta] = useState(false);
	const starGateRef = useRef(false);

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			i += 1;
			setTyped(FULL_TEXT.slice(0, i));
			if (i >= FULL_TEXT.length) {
				clearInterval(interval);
				setTextDone(true);
			}
		}, 35);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!textDone) return;

		const start = performance.now();
		let raf = 0;
		const tick = () => {
			const now = performance.now();
			const elapsed = Math.min(BAR_FILL_DURATION_MS, now - start);
			const t = BAR_FILL_DURATION_MS > 0 ? elapsed / BAR_FILL_DURATION_MS : 1;
			const pct = Math.min(100, t * 100);
			setBarPct(pct);

			if (!starGateRef.current && pct >= 90) {
				starGateRef.current = true;
				setShowTransmitStar(true);
			}

			if (pct >= 100) {
				setShowCta(true);
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [textDone]);

	useEffect(() => {
		if (showTransmitStar && soundManager.preloaded) {
			soundManager.play('chime');
		}
	}, [showTransmitStar]);

	const handleCta = () => {
		soundManager.play('clickMenu', true);
		onContinue();
	};

	return (
		<div
			className={`tut-mascot-stage ${textDone ? 'tut-mascot-stage--transmit-dock' : ''}`}
			role="dialog"
			aria-live="polite"
		>
			<div className="tut-mascot-bg" aria-hidden="true">
				<Bg1 />
			</div>

			<div className="tut-mascot-stack">
				<div className="tut-mascot-star-slot" aria-hidden={!showTransmitStar}>
					{showTransmitStar && <TutorialTransmitStar />}
				</div>

				<div className="tut-mascot-image-wrap">
					<img
						className="tut-mascot-image"
						src={resolvePath('/tutorial/mascot-image.png')}
						alt=""
						draggable={false}
					/>
				</div>

				<div className="tut-mascot-bubble">
					<p className="tut-mascot-text">
						{typed}
						{typed.length < FULL_TEXT.length && (
							<span className="tut-typewriter-caret" aria-hidden="true" />
						)}
					</p>
					<div className={`tut-mascot-cta ${showCta ? 'tut-mascot-cta-show' : ''}`}>
						<button className="tut-cta" onClick={handleCta} type="button" disabled={!showCta}>
							Let&apos;s Go
						</button>
					</div>
				</div>
			</div>

			{textDone && (
				<div className="tut-mascot-transmit-dock" aria-hidden="true">
					<span className="tut-mascot-transmit-label">Star Transmit</span>
					<div className="tut-mascot-transmit-track">
						<div className="tut-mascot-transmit-fill" style={{ width: `${barPct}%` }} />
					</div>
				</div>
			)}
		</div>
	);
};

export default MascotMoment;
