import React from 'react';
import { resolvePath } from '../../utils/paths';

interface MockEnemyProps {
	left: string;
	top: string;
	variant?: 'purple' | 'yellow' | 'blue';
	frame?: 0 | 1 | 2 | 3;
	delay?: number;
	clickable?: boolean;
	killed?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	/** Step 3: pulsing purple rim so the target pops above the dim + castle layer */
	glow?: boolean;
	/** Renders above StepCastleHighlight + backdrop (z-index) */
	aboveSpotlight?: boolean;
	/** Step 6: walking toward throne — no fade/bob; parent drives `frame` for walk cycle */
	marching?: boolean;
}

const VARIANT_FOLDER: Record<NonNullable<MockEnemyProps['variant']>, string> = {
	purple: 'PurpleCommon',
	yellow: 'YellowCommon',
	blue: 'BlueCommon'
};

const MockEnemy: React.FC<MockEnemyProps> = ({
	left,
	top,
	variant = 'purple',
	frame = 0,
	delay = 0,
	clickable,
	killed,
	onClick,
	glow,
	aboveSpotlight,
	marching
}) => {
	const folder = VARIANT_FOLDER[variant];
	const src = resolvePath(`/enemies/${folder}/Follow/${frame}.svg`);

	const className = [
		'tut-enemy',
		marching ? 'tut-enemy-marching' : 'tut-enemy-fade',
		aboveSpotlight ? 'tut-enemy-front' : '',
		glow && !killed ? 'tut-enemy-glow' : '',
		clickable ? 'tut-enemy-clickable' : '',
		killed ? 'tut-enemy-killed' : ''
	].filter(Boolean).join(' ');

	return (
		<div
			className={className}
			style={{
				left,
				top,
				animationDelay: `${delay}ms, 0ms`
			}}
			onClick={onClick}
			role={clickable ? 'button' : undefined}
			aria-label={clickable ? 'Tap to kill enemy' : undefined}
		>
			<img src={src} alt="" draggable={false} />
		</div>
	);
};

export default MockEnemy;
