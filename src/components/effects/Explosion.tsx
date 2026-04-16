import React, { useState, useEffect } from 'react';

interface ExplosionProps {
	entity: any;
}

const Explosion: React.FC<ExplosionProps> = ({ entity }) => {
	const frameWidth = 320;
	const frameHeight = 344;
	const cols = 4;
	const totalFrames = 8;
	const duration = 1000;
	const frameDuration = duration / totalFrames;

	const [currentFrame, setCurrentFrame] = useState(0);

	const bgX = (currentFrame % cols) * frameWidth;
	const bgY = Math.floor(currentFrame / cols) * frameHeight;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFrame(prev => {
				if (prev < totalFrames - 1) {
					return prev + 1;
				} else {
					clearInterval(interval);
					entity?.removeVFX?.('Explosion');
					return prev;
				}
			});
		}, frameDuration);

		return () => clearInterval(interval);
	}, [entity, frameDuration]);

	return (
		<div
			className="explosion-effect"
			style={{
				width: `${frameWidth}px`,
				height: `${frameHeight}px`,
				backgroundPosition: `-${bgX}px -${bgY}px`
			}}
		/>
	);
};

export default Explosion;
