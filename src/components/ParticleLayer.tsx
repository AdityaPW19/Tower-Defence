import React, { useState, useEffect, memo } from 'react';
import { particleManager } from '../stores/ParticleManager';

const ParticleLayer: React.FC = () => {
	const [particles, setParticles] = useState<any[]>([]);

	useEffect(() => {
		const update = () => {
			const next = particleManager.particles;
			setParticles((prev) => (prev === next || (prev.length === 0 && next.length === 0) ? prev : next.slice()));
		};
		const unsub = particleManager.subscribe(update);
		return () => unsub();
	}, []);

	if (particles.length === 0) return null;

	return (
		<div className="particle-layer">
			{particles.map((p, i) => (
				<div
					key={i}
					className="particle"
					style={{
						left: p.x,
						top: p.y,
						width: p.size,
						height: p.size,
						backgroundColor: p.color,
						opacity: p.life
					}}
				/>
			))}
		</div>
	);
};

export default memo(ParticleLayer);
