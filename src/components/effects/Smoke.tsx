import React, { useState, useEffect, memo } from 'react';
import { resolvePath } from '../../utils/paths';

interface SmokeProps {
	entity: any;
}

const Smoke: React.FC<SmokeProps> = ({ entity }) => {
	const frameWidth = 174;
	const frameHeight = 249.5;
	const cols = 7;
	const totalFrames = 14;
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
					entity?.removeVFX?.('Smoke');
					return prev;
				}
			});
		}, frameDuration);

		return () => clearInterval(interval);
	}, [entity, frameDuration]);

	return (
		<div
			className="smoke-effect"
			style={{
				width: `${frameWidth}px`,
				height: `${frameHeight}px`,
				backgroundPosition: `-${bgX}px -${bgY}px`,
				backgroundImage: `url(${resolvePath('/sprites/smoke-anim-sprite.png')})`
			}}
		/>
	);
};

export default memo(Smoke);
