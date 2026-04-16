import React from 'react';

interface HowToPlayProps {
	onClose: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
	return (
		<div className="how-to-play-overlay" onClick={onClose}>
			<div className="how-to-play-content" onClick={(e) => e.stopPropagation()}>
				<h2>How to Play</h2>
				<div className="instructions">
					<p><strong>Objective:</strong> Protect the throne from waves of enemies!</p>
					<p><strong>Build Towers:</strong> Click gray spots to build towers (requires build points)</p>
					<p><strong>Upgrade Towers:</strong> Click built towers to upgrade (costs gold + build points)</p>
					<p><strong>Attack Enemies:</strong> Click on enemies to damage them (costs 5 gold)</p>
					<p><strong>Answer Questions:</strong> Correctly answering questions earns build points</p>
					<p><strong>Strikes:</strong> 3 wrong answers = lose a tower!</p>
				</div>
				<button className="game-button" onClick={onClose}>Got it!</button>
			</div>
		</div>
	);
};

export default HowToPlay;
