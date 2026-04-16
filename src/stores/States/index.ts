import * as EnemyStates from './Enemy';
import * as TowerStates from './Tower';
import * as ProjectileStates from './Projectiles';
import * as ThroneStates from './Throne';
import type { StateMachine } from '../StateMachine';
import type { BaseState } from '../BaseState';

type StateConstructor = new (stateMachine: StateMachine, stateContext?: Record<string, any>) => BaseState;

export const initState = (
	stateMachine: StateMachine,
	entityType: string,
	name: string,
	stateContext: Record<string, any> = {}
): BaseState => {
	let States: Record<string, StateConstructor> = {};

	if (entityType === 'enemy') {
		States = EnemyStates as unknown as Record<string, StateConstructor>;
	} else if (entityType === 'tower') {
		States = TowerStates as unknown as Record<string, StateConstructor>;
	} else if (['projectile', 'loot'].includes(entityType)) {
		States = ProjectileStates as unknown as Record<string, StateConstructor>;
	} else if (entityType === 'throne') {
		States = ThroneStates as unknown as Record<string, StateConstructor>;
	}

	const State = States[name];

	if (!State) {
		throw new Error(`Invalid entity type: ${entityType} with state name ${name}`);
	}

	return new State(stateMachine, stateContext);
};
