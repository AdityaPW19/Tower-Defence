import React, { useState, useEffect, useRef } from 'react';
import { screen } from '../stores/Screen';
import { Vector2 } from '../stores/Vector2';
import { getAnimation } from '../config/animations';
import { resolvePath } from '../utils/paths';
import Effect from './Effect';

interface StaticEntityProps {
	entity: any;
	onClick?: (e: React.MouseEvent) => void;
	style?: React.CSSProperties;
}

const StaticEntity: React.FC<StaticEntityProps> = ({ entity, onClick, style }) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	const animation = entity.animation ? getAnimation(entity.animation.name) : null;
	const frame = animation?.frames[entity.animation?.currentFrame || 0] || null;

	const scale = screen.isMobile ? entity.scale - 0.3 : entity.scale;
	const transform = `scale(${scale})`;

	useEffect(() => {
		if (imgRef.current && imageLoaded) {
			const rect = imgRef.current.getBoundingClientRect();
			const parentRect = imgRef.current.offsetParent?.getBoundingClientRect() ?? { x: 0, y: 0 };
			entity.position = new Vector2(rect.x - parentRect.x, rect.y - parentRect.y);
			entity.width = rect.width;
			entity.height = rect.height;
		}
	}, [imageLoaded, entity, frame]);

	if (!frame) return null;

	return (
		<>
			<img
				ref={imgRef}
				className="static-entity"
				style={{
					transform,
					cursor: onClick ? 'pointer' : 'default',
					pointerEvents: onClick ? 'auto' : 'none',
					...style
				}}
				src={resolvePath(frame)}
				alt={entity.name}
				onClick={onClick}
				onLoad={() => setImageLoaded(true)}
			/>
			{entity.vfx?.map((effectName: string, i: number) => (
				<Effect key={`${effectName}-${i}`} name={effectName} entity={entity} />
			))}
		</>
	);
};

export default StaticEntity;
