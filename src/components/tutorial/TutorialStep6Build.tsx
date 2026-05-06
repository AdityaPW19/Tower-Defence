import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { soundManager } from '../../stores/soundManager';
import { resolvePath } from '../../utils/paths';
import MockBoard, { type TowerSpotId } from './MockBoard';
import MockEnemy from './MockEnemy';
import LootIcon from '../LootIcon';

const INITIAL_COINS = 100;

/** Match TowerShoot.tsx muzzle tint per tower */
const SHOOT_COLORS: Record<TowerSpotId, string> = {
	tl: '#9AD5FF',
	tr: '#E45F01',
	bl: '#6CE966',
	br: '#FFF263'
};

/** Enemy spawns off-screen (toward throne) — mirrors top/bottom spawn lanes on mobile */
const SPAWN_OFF: Record<TowerSpotId, { left: string; top: string }> = {
	tl: { left: '38%', top: '-18%' },
	tr: { left: '62%', top: '-18%' },
	bl: { left: '38%', top: '118%' },
	br: { left: '62%', top: '118%' }
};

const PROJ_FRAMES: Record<TowerSpotId, readonly string[]> = {
	tl: ['/projectiles/Icebolt/Follow/0.svg', '/projectiles/Icebolt/Follow/1.svg'],
	tr: [
		'/projectiles/Fireball/Follow/0.svg',
		'/projectiles/Fireball/Follow/1.svg',
		'/projectiles/Fireball/Follow/2.svg',
		'/projectiles/Fireball/Follow/3.svg'
	],
	bl: [
		'/projectiles/Poisonball/Follow/0.svg',
		'/projectiles/Poisonball/Follow/1.svg',
		'/projectiles/Poisonball/Follow/2.svg',
		'/projectiles/Poisonball/Follow/3.svg'
	],
	br: [
		'/projectiles/Thunderbolt/Follow/0.svg',
		'/projectiles/Thunderbolt/Follow/1.svg',
		'/projectiles/Thunderbolt/Follow/2.svg',
		'/projectiles/Thunderbolt/Follow/3.svg'
	]
};

interface TutorialStep6BuildProps {
	onComplete: () => void;
	/** Persist chosen spot for tutorial board on steps 7+ */
	onBuiltSpot?: (spot: TowerSpotId) => void;
	totalSteps?: number;
}

function motionReduced(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const TutorialStep6Build: React.FC<TutorialStep6BuildProps> = ({
	onComplete,
	onBuiltSpot,
	totalSteps = 7
}) => {
	const [builtSpot, setBuiltSpot] = useState<TowerSpotId | null>(null);
	const [buildPoints, setBuildPoints] = useState(1);
	const [coins, setCoins] = useState(INITIAL_COINS);
	const [enemyKilled, setEnemyKilled] = useState(false);
	const [walkFrame, setWalkFrame] = useState(0);
	const [floaterPx, setFloaterPx] = useState<{ left: number; top: number } | null>(null);
	const [burstPx, setBurstPx] = useState<{ left: number; top: number; key: number } | null>(
		null
	);
	const [lootBump, setLootBump] = useState(false);
	const [shootFlash, setShootFlash] = useState<{
		left: number;
		top: number;
		color: string;
		key: number;
	} | null>(null);
	const [projFrame, setProjFrame] = useState(0);
	const [projSpinDeg, setProjSpinDeg] = useState(0);
	const completedRef = useRef(false);
	const enemyShellRef = useRef<HTMLDivElement | null>(null);
	const projectileRef = useRef<HTMLDivElement | null>(null);

	const [projFlight, setProjFlight] = useState<{
		x0: number;
		y0: number;
		dx: number;
		dy: number;
	} | null>(null);

	useLayoutEffect(() => {
		if (!projFlight || !projectileRef.current) return;
		const el = projectileRef.current;
		el.classList.remove('tut-step6-projectile--fly');
		el.style.left = `${projFlight.x0}px`;
		el.style.top = `${projFlight.y0}px`;
		el.style.setProperty('--dx', `${projFlight.dx}px`);
		el.style.setProperty('--dy', `${projFlight.dy}px`);
		window.requestAnimationFrame(() => {
			projectileRef.current?.classList.add('tut-step6-projectile--fly');
		});
	}, [projFlight]);

	useEffect(() => {
		if (!projFlight || !builtSpot) return;
		const frames = PROJ_FRAMES[builtSpot];
		let i = 0;
		const id = window.setInterval(() => {
			i = (i + 1) % frames.length;
			setProjFrame(i);
		}, 72);
		return () => window.clearInterval(id);
	}, [projFlight, builtSpot]);

	useEffect(() => {
		if (builtSpot) setWalkFrame(0);
	}, [builtSpot]);

	useEffect(() => {
		if (!builtSpot || enemyKilled) return;
		const id = window.setInterval(() => setWalkFrame(f => (f + 1) % 3), 105);
		return () => window.clearInterval(id);
	}, [builtSpot, enemyKilled]);

	const finishStep = useCallback(() => {
		if (completedRef.current) return;
		completedRef.current = true;
		onComplete();
	}, [onComplete]);

	useEffect(() => {
		if (!builtSpot) return;
		let cancelled = false;
		const ids: number[] = [];
		const queue = (fn: () => void, ms: number) => {
			ids.push(
				window.setTimeout(() => {
					if (!cancelled) fn();
				}, ms)
			);
		};

		const reduce = motionReduced();
		const fireDelay = reduce ? 220 : 1620;
		const flightMs = reduce ? 100 : 450;

		queue(() => {
			const towerEl = document.querySelector(
				`[data-tutorial-spot="${builtSpot}"]`
			) as HTMLElement | null;
			const enemyEl = enemyShellRef.current;
			if (!towerEl || !enemyEl) return;
			const t = towerEl.getBoundingClientRect();
			const e = enemyEl.getBoundingClientRect();
			const x0 = t.left + t.width / 2;
			const y0 = t.top + t.height * 0.3;
			const x1 = e.left + e.width / 2;
			const y1 = e.top + e.height / 2;
			const dx = x1 - x0;
			const dy = y1 - y0;
			setProjSpinDeg((Math.atan2(dy, dx) * 180) / Math.PI + 90);
			setProjFrame(0);
			setProjFlight({ x0, y0, dx, dy });
			setShootFlash({
				left: x0,
				top: y0,
				color: SHOOT_COLORS[builtSpot],
				key: Date.now()
			});
		}, fireDelay);

		queue(() => {
			soundManager.play('towerShoot', true);
		}, fireDelay + 20);

		queue(() => {
			setShootFlash(null);
		}, fireDelay + 340);

		queue(() => {
			const enemyEl = enemyShellRef.current;
			const rect = enemyEl?.getBoundingClientRect();
			if (rect) {
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				setBurstPx({ left: cx, top: cy, key: Date.now() });
				setFloaterPx({ left: cx + 18, top: rect.top - 4 });
			}
			setEnemyKilled(true);
			setProjFlight(null);
			soundManager.play('clickEnemy', true);
		}, fireDelay + flightMs);

		queue(() => {
			setLootBump(true);
			setCoins(c => c + 1);
			window.setTimeout(() => setLootBump(false), 560);
		}, fireDelay + flightMs + 90);

		queue(() => {
			finishStep();
		}, fireDelay + 3200);

		return () => {
			cancelled = true;
			ids.forEach(clearTimeout);
		};
	}, [builtSpot, finishStep]);

	const handleSpotPick = useCallback((spotId: TowerSpotId) => {
		if (builtSpot) return;
		soundManager.play('towerUpgrade');
		setBuiltSpot(spotId);
		setBuildPoints(0);
		onBuiltSpot?.(spotId);
	}, [builtSpot, onBuiltSpot]);

	const projSrc =
		builtSpot && projFlight
			? resolvePath(PROJ_FRAMES[builtSpot][projFrame % PROJ_FRAMES[builtSpot].length])
			: null;

	return (
		<>
			<MockBoard
				highlightTowers={!builtSpot}
				useCastleArt
				omitCenterCastle={false}
				buildMode
				builtSpot={builtSpot}
				onTowerSpotPick={handleSpotPick}
			/>

			{builtSpot && (
				<div
					ref={enemyShellRef}
					className={[
						'tut-step6-enemy-route',
						enemyKilled ? 'tut-step6-enemy-route--halt' : ''
					]
						.filter(Boolean)
						.join(' ')}
					style={
						{
							['--from-left']: SPAWN_OFF[builtSpot].left,
							['--from-top']: SPAWN_OFF[builtSpot].top
						} as React.CSSProperties
					}
				>
					<div style={{ position: 'relative', width: '100%', height: '100%' }}>
						<MockEnemy
							left="0"
							top="0"
							variant="purple"
							frame={[0, 1, 2][walkFrame % 3] as 0 | 1 | 2}
							delay={0}
							killed={enemyKilled}
							aboveSpotlight
							marching
						/>
					</div>
				</div>
			)}

			{shootFlash && (
				<div
					key={shootFlash.key}
					className="shoot-effect tut-step6-tower-shoot-flash"
					style={
						{
							left: shootFlash.left,
							top: shootFlash.top,
							'--effect-color': shootFlash.color
						} as React.CSSProperties
					}
					aria-hidden
				/>
			)}

			{projFlight && projSrc && (
				<div className="tut-step6-projectile" ref={projectileRef} aria-hidden>
					<img
						src={projSrc}
						alt=""
						draggable={false}
						style={{ transform: `rotate(${projSpinDeg}deg)` }}
					/>
				</div>
			)}

			{floaterPx && (
				<div className="tut-step6-coin-float" style={floaterPx} aria-hidden>
					+1
				</div>
			)}

			{burstPx && (
				<div
					className="tut-burst"
					key={burstPx.key}
					style={{ left: burstPx.left, top: burstPx.top }}
					aria-hidden
				/>
			)}

			<div
				className={`build-points-hud tut-step6-overlay-bp ${buildPoints > 0 ? 'has-points' : ''}`}
			>
				<span className="bp-icon" aria-hidden="true">
					🛠️
				</span>
				<span className="bp-count">{buildPoints}</span>
			</div>

			<div className={`loot tut-step6-overlay-loot ${lootBump ? 'tut-loot-gain' : ''}`}>
				<LootIcon width={40} height={40} />
				<span>{coins}</span>
			</div>

			{!builtSpot && (
				<div className="tut-step-card tut-popup tut-step6-hint" role="dialog" aria-live="polite">
					<span className="tut-step-pill">Step 6/{totalSteps}</span>
					<h2 className="tut-step-title">Good! You earned a build point.</h2>
					<p className="tut-step-sub">Tap any glowing platform to build a tower.</p>
				</div>
			)}
		</>
	);
};

export default TutorialStep6Build;
