import React, { useState, useEffect, useRef } from 'react';
import { screen } from '../stores/Screen';
import { getAnimation } from '../config/animations';
import { resolvePath } from '../utils/paths';

interface DynamicEntityProps {
	entity: any;
	zIndex?: number;
}

const DynamicEntity: React.FC<DynamicEntityProps> = ({ entity, zIndex = 5 }) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	const animation = entity.animation ? getAnimation(entity.animation.name) : null;
	const frame = animation?.frames[entity.animation?.currentFrame || 0] || null;

	const scale = screen.isMobile ? entity.scale - 0.2 : entity.scale;
	const translateX = entity.position?.x || 0;
	const translateY = entity.position?.y || 0;
	const rotation = entity.rotation || 0;

	const transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;

	useEffect(() => {
		if (imgRef.current && imageLoaded) {
			const rect = imgRef.current.getBoundingClientRect();
			entity.width = rect.width;
			entity.height = rect.height;
		}
	}, [imageLoaded, entity]);

	if (!frame) return null;

	return (
		<img
			ref={imgRef}
			className="dynamic-entity"
			style={{
				left: 0,
				top: 0,
				transform,
				zIndex
			}}
			src={resolvePath(frame)}
			alt={entity.name}
			onLoad={() => setImageLoaded(true)}
		/>
	);
};

export default DynamicEntity;
