import React, { useState, useEffect, useRef, useCallback } from 'react';
import { managers } from '../stores/managers';

interface VisualFeedbackProps {
	children: React.ReactNode;
}

const VisualFeedback: React.FC<VisualFeedbackProps> = ({ children }) => {
	const [isShaking, setIsShaking] = useState(false);
	const lastKnownWrongAnswerTriggerRef = useRef(-1);

	useEffect(() => {
		let rafId: number;
		
		const tick = () => {
			const qm = managers.get('questionManager');
			if (qm) {
				if (qm.wrongAnswerTrigger !== lastKnownWrongAnswerTriggerRef.current) {
					if (lastKnownWrongAnswerTriggerRef.current !== -1) {
						setIsShaking(true);
					}
					lastKnownWrongAnswerTriggerRef.current = qm.wrongAnswerTrigger;
				}
			}
			rafId = requestAnimationFrame(tick);
		};
		
		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleAnimationEnd = useCallback(() => {
		setIsShaking(false);
	}, []);

	return (
		<div 
			className={`feedback-layer ${isShaking ? 'shake-effect' : ''}`}
			onAnimationEnd={handleAnimationEnd}
		>
			{children}
		</div>
	);
};

export default VisualFeedback;
