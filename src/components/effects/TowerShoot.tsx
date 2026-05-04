import React, { memo } from 'react';

interface TowerShootProps {
	entity: any;
}

const TowerShoot: React.FC<TowerShootProps> = ({ entity }) => {
	const getColor = () => {
		switch (entity?.name) {
			case 'IceTower':
				return '#9AD5FF';
			case 'FireTower':
				return '#E45F01';
			case 'ThunderTower':
				return '#FFF263';
			case 'PoisonTower':
				return '#6CE966';
			default:
				return '#ffffff';
		}
	};

	const getEffectOffset = () => {
		if (entity?.upgradeLevel === 0) {
			return { x: (entity?.width || 60) / 2, y: 22 };
		} else if (entity?.upgradeLevel === 1) {
			return { x: (entity?.width || 60) / 2, y: 23 };
		} else {
			return { x: (entity?.width || 60) / 2, y: 24 };
		}
	};

	const color = getColor();
	const offset = getEffectOffset();

	const handleAnimationEnd = () => {
		entity?.removeVFX?.('TowerShoot');
	};

	return (
		<div
			className="shoot-effect"
			style={{
				'--effect-color': color,
				left: `${offset.x}px`,
				top: `${offset.y}px`
			} as React.CSSProperties}
			onAnimationEnd={handleAnimationEnd}
		/>
	);
};

export default memo(TowerShoot);
