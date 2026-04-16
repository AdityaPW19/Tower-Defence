import React, { useState } from 'react';
import MenuLayout from './MenuLayout';
import Button from './Button';
import HowToPlay from './HowToPlay';

interface StartScreenProps {
	onStart: () => void;
	preloaded: boolean;
	preloadPercent: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, preloaded, preloadPercent }) => {
	const [showHowToPlay, setShowHowToPlay] = useState(false);

	const text = preloaded ? 'Start game' : `${preloadPercent}%`;

	return (
		<MenuLayout>
			<div className="start-content">
				<img src="/logos/knowledge-space2.png" alt="Knowledge Space" className="logo-image" />
				
				<div className="star-container">
					<img src="/enemies/enemies-riding-art.png" alt="Shooting Star" className="shooting-star-art" />
				</div>

				<div className="hints">
					<h2>Hint:</h2>
					<p>- Click on an Enemy to kill it</p>
					<p>- Click on a gray spot to build a Tower</p>
					<p>- Click on a Tower to upgrade</p>
				</div>

				<div className="buttons-container">
					<Button disabled={!preloaded} text={text} onClick={onStart} />
					<div style={{ height: 10 }} />
					<Button text="How to Play" onClick={() => setShowHowToPlay(true)} />
				</div>
			</div>

			{showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
		</MenuLayout>
	);
};

export default StartScreen;
