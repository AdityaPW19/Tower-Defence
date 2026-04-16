import React, { useEffect } from 'react';
import { soundManager } from '../stores/soundManager';

interface BlinkingStarProps {
	x: number;
	y: number;
}

const BlinkingStar: React.FC<BlinkingStarProps> = ({ x, y }) => {
	useEffect(() => {
		if (soundManager.preloaded) {
			soundManager.play('chime');
		}
	}, []);

	return (
		<div 
			className="blinking-star-container"
			style={{ left: `${x}%`, top: `${y}%` }}
		>
			<div className="star-core" />
			<div className="star-rays" />
			<div className="star-glow" />
		</div>
	);
};

export default BlinkingStar;
