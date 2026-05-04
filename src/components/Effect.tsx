import React, { memo } from 'react';
import * as Effects from './effects';

interface EffectProps {
	name: string;
	entity: any;
}

const Effect: React.FC<EffectProps> = ({ name, entity }) => {
	const EffectComponent = (Effects as any)[name];

	if (!EffectComponent) {
		console.warn(`Effect with name ${name} not found for entity ${entity?.name}`);
		return null;
	}

	return <EffectComponent entity={entity} />;
};

export default memo(Effect);
