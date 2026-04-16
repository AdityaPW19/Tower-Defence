import React, { useState, useEffect } from 'react';
import { particleManager } from '../stores/ParticleManager';

const ParticleLayer: React.FC = () => {
	const [particles, setParticles] = useState<any[]>([]);

	useEffect(() => {
		const update = () => {
			setParticles([...particleManager.particles]);
		};
		const unsub = particleManager.subscribe(update);
		return () => unsub();
	}, []);

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

export default ParticleLayer;
