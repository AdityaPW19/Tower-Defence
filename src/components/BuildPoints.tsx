import React, { useState, useEffect, useRef } from 'react';
import { managers } from '../stores/managers';
import { cursor } from '../stores/Cursor';

const BuildPoints: React.FC = () => {
	const [points, setPoints] = useState(0);
	const [isAnimated, setIsAnimated] = useState(false);
	const prevPointsRef = useRef(0);

	useEffect(() => {
		let rafId: number;
		let lastPoints = -1;

		const tick = () => {
			const qm = managers.get('questionManager');
			if (qm) {
				const next = qm.buildPoints || 0;
				if (next !== lastPoints) {
					lastPoints = next;
					setPoints(next);
					if (next > prevPointsRef.current) {
						setIsAnimated(true);
					}
					prevPointsRef.current = next;
				}
			}
			rafId = requestAnimationFrame(tick);
		};

		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleAnimationEnd = () => {
		setIsAnimated(false);
	};

	const hasPoints = points > 0;

	return (
		<div
			className={`build-points-hud ${hasPoints ? 'has-points' : ''} ${isAnimated ? 'isAnimated' : ''}`}
			style={{ cursor: cursor.get('arrow') }}
			onAnimationEnd={handleAnimationEnd}
		>
			<span className="bp-icon" aria-hidden="true">🛠️</span>
			<span className="bp-count">{points}</span>
		</div>
	);
};

export default BuildPoints;
