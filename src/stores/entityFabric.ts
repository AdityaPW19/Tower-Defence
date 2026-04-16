import { getConfig } from '../config/entities';
import { Entity } from './Entity';
import { Vector2 } from './Vector2';

export const initEntity = (name: string, position: Vector2, stateContext: Record<string, any> = {}) => {
	const config = getConfig(name);
	const { initialState, ...restConfig } = config;

	const finalConfig = {
		...restConfig,
		initialState: stateContext.initialState || initialState,
		width: config.width || 64,
		height: config.height || 64
	};

	const entity = new Entity(name, position.clone(), finalConfig as any, stateContext);
	return entity;
};
