import React, { memo } from 'react';

/**
 * Tutorial-only “transmit ready” sparkle above the mascot.
 * Mirrors the gameplay BlinkingStar look without importing gameplay components.
 */
const TutorialTransmitStar: React.FC = () => (
	<div className="tut-transmit-star-root" aria-hidden="true">
		<div className="tut-transmit-star-extra" />
		<div className="tut-transmit-star-glow" />
		<div className="tut-transmit-star-rays" />
		<div className="tut-transmit-star-core" />
	</div>
);

export default memo(TutorialTransmitStar);
