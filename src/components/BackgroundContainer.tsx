import React, { memo } from 'react';
import Bg1 from './backgrounds/Bg1';
import Bg2 from './backgrounds/Bg2';
import Bg3 from './backgrounds/Bg3';
import Bg4 from './backgrounds/Bg4';

interface BackgroundContainerProps {
	stageNumber: number;
}

const backgrounds = [Bg1, Bg2, Bg3, Bg4];

const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ stageNumber }) => {
	const Background = backgrounds[stageNumber] || Bg1;

	return (
		<div className="background-container">
			<Background />
		</div>
	);
};

export default memo(BackgroundContainer);
