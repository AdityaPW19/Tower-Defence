import { enemies, type EntityConfig } from './enemies';
import { towers } from './towers';
import { projectiles } from './projectiles';

export const entities: Record<string, EntityConfig> = { ...enemies, ...towers, ...projectiles };

const entitiesDefined =
	Object.keys(enemies).length + Object.keys(towers).length + Object.keys(projectiles).length;

const entitiesExported = Object.keys(entities).length;

if (entitiesDefined !== entitiesExported) {
	throw new Error(
		`Entities defined and exported do not match. Check for duplicated Entity names : Total count: ${entitiesDefined} / Exported count ${entitiesExported}`
	);
}

export const getConfig = (name: string): EntityConfig => {
	if (!entities[name]) throw new Error(`Entity config not found for: ${name}`);
	return entities[name];
};

export type { EntityConfig };
