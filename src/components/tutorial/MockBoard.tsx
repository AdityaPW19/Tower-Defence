import React from 'react';
import { resolvePath } from '../../utils/paths';

export type TowerSpotId = 'tl' | 'tr' | 'bl' | 'br';

interface MockBoardProps {
	highlightTowers?: boolean;
	useCastleArt?: boolean;
	/** Steps 1–3: castle is drawn in StepCastleHighlight above the backdrop */
	omitCenterCastle?: boolean;
	/** Step 6: platforms are tappable; shows built tower on chosen spot */
	buildMode?: boolean;
	builtSpot?: TowerSpotId | null;
	onTowerSpotPick?: (id: TowerSpotId) => void;
}

const TOP_LEFT = { left: '22%', top: '15%' };
const TOP_RIGHT = { left: '78%', top: '15%' };
const BOTTOM_LEFT = { left: '22%', top: '85%' };
const BOTTOM_RIGHT = { left: '78%', top: '85%' };

const SPOTS: Array<{ id: TowerSpotId; pos: typeof TOP_LEFT; builtSrc: string }> = [
	{ id: 'tl', pos: TOP_LEFT, builtSrc: '/towers/IceTower/Base0.svg' },
	{ id: 'tr', pos: TOP_RIGHT, builtSrc: '/towers/FireTower/Base0.svg' },
	{ id: 'bl', pos: BOTTOM_LEFT, builtSrc: '/towers/PoisonTower/Base0.svg' },
	{ id: 'br', pos: BOTTOM_RIGHT, builtSrc: '/towers/ThunderTower/Base0.svg' }
];

export const TOWER_POSITIONS = {
	topLeft: TOP_LEFT,
	topRight: TOP_RIGHT,
	bottomLeft: BOTTOM_LEFT,
	bottomRight: BOTTOM_RIGHT
};

export const CASTLE_POSITION = { left: '50%', top: '50%' };

interface TowerSpotProps {
	id: TowerSpotId;
	pos: { left: string; top: string };
	showHighlight: boolean;
	buildMode?: boolean;
	builtSpot?: TowerSpotId | null;
	builtImg?: string;
	onPick?: () => void;
}

const TowerSpot: React.FC<TowerSpotProps> = ({
	id,
	pos,
	showHighlight,
	buildMode,
	builtSpot,
	builtImg,
	onPick
}) => {
	const isBuiltHere = builtSpot === id;
	const highlight = showHighlight && !isBuiltHere;
	const canPick =
		buildMode && !builtSpot && onPick;

	const outerStyle: React.CSSProperties = {
		position: 'absolute',
		left: pos.left,
		top: pos.top,
		transform: 'translate(-50%, -50%)'
	};

	const content = (
		<>
			<img
				src={resolvePath(isBuiltHere && builtImg ? builtImg : '/towers/Base.svg')}
				alt=""
				draggable={false}
			/>
		</>
	);

	const className = [
		'tut-tower-spot',
		highlight ? 'tut-highlight' : '',
		canPick ? 'tut-tower-spot--build' : '',
		isBuiltHere ? 'tut-tower-spot--built' : ''
	]
		.filter(Boolean)
		.join(' ');

	if (canPick) {
		return (
			<button
				type="button"
				className={className}
				style={outerStyle}
				data-tutorial-spot={id}
				onClick={() => onPick?.()}
				aria-label={`Build tower (${id})`}
			>
				{content}
			</button>
		);
	}

	return (
		<div className={className} style={outerStyle} data-tutorial-spot={id} aria-hidden>
			{content}
		</div>
	);
};

const MockBoard: React.FC<MockBoardProps> = ({
	highlightTowers,
	useCastleArt,
	omitCenterCastle,
	buildMode,
	builtSpot,
	onTowerSpotPick
}) => {
	return (
		<div className="tut-board tut-step6-board-root" aria-hidden={!buildMode}>
			<div className="tut-board-stars" />
			<div className="tut-board-grid" />

			{SPOTS.map(({ id, pos, builtSrc }) => (
				<TowerSpot
					key={id}
					id={id}
					pos={pos}
					showHighlight={!!highlightTowers}
					buildMode={buildMode}
					builtSpot={builtSpot ?? null}
					builtImg={builtSrc}
					onPick={
						buildMode && onTowerSpotPick ? () => onTowerSpotPick(id) : undefined
					}
				/>
			))}

			{!omitCenterCastle && (
				<div
					className="tut-throne"
					style={{
						position: 'absolute',
						left: CASTLE_POSITION.left,
						top: CASTLE_POSITION.top,
						transform: 'translate(-50%, -50%)'
					}}
				>
					<img
						src={resolvePath(useCastleArt ? '/castle/castle.png' : '/throne.svg')}
						alt=""
						draggable={false}
					/>
				</div>
			)}
		</div>
	);
};

export default MockBoard;
