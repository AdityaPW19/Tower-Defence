import React, { useState, useEffect, useRef } from 'react';
import { lootTracker } from '../stores/LootTracker';
import { cursor } from '../stores/Cursor';
import LootIcon from './LootIcon';

const Loot: React.FC = () => {
	const [collectedLoot, setCollectedLoot] = useState(lootTracker.collectedLoot);
	const [isAnimated, setIsAnimated] = useState(false);
	const prevAnimationRef = useRef(false);

	useEffect(() => {
		let rafId: number;
		let lastLoot = lootTracker.collectedLoot;

		const tick = () => {
			const nextLoot = lootTracker.collectedLoot;
			if (nextLoot !== lastLoot) {
				lastLoot = nextLoot;
				setCollectedLoot(nextLoot);
			}

			const shouldAnimate = lootTracker.playLowLootAnimation;
			if (shouldAnimate && !prevAnimationRef.current) {
				setIsAnimated(true);
			}
			prevAnimationRef.current = shouldAnimate;

			rafId = requestAnimationFrame(tick);
		};

		tick();
		return () => cancelAnimationFrame(rafId);
	}, []);

	const handleAnimationEnd = () => {
		setIsAnimated(false);
		lootTracker.unsetAnimation('LowLoot');
	};

	return (
		<div 
			className={`loot ${isAnimated ? 'isAnimated' : ''}`}
			style={{ cursor: cursor.get('arrow') }}
			onAnimationEnd={handleAnimationEnd}
		>
			<LootIcon />
			<span style={{ cursor: cursor.get('arrow') }}>{collectedLoot}</span>
		</div>
	);
};

export default Loot;
