import React from 'react';

interface HealthBarProps {
	entity: any;
}

const SEGMENT_MARKERS = [20, 40, 60, 80];

const HealthBar: React.FC<HealthBarProps> = ({ entity }) => {
	if (!entity?.stats) return null;

	const maxHealth = entity.stats.maxHealth || 500;
	const health = entity.stats.health || 0;
	const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));

	let healthClass = 'high';
	if (healthPercentage <= 20) healthClass = 'low';
	else if (healthPercentage <= 60) healthClass = 'medium';

	return (
		<div className="health-bar-container" style={{ width: entity.width || 128 }}>
			<div className="health-bar-background">
				{SEGMENT_MARKERS.map((marker, i) => (
					<div key={i} className="segment-marker" style={{ left: `${marker}%` }} />
				))}
				<div 
					className={`health-bar-fill ${healthClass}`}
					style={{ width: `${healthPercentage}%` }}
				/>
			</div>
		</div>
	);
};

export default HealthBar;
