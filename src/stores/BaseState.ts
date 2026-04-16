import type { Entity } from './Entity';
import type { StateMachine } from './StateMachine';

export class BaseState {
	name: string;
	stateMachine: StateMachine;

	constructor(stateMachine: StateMachine, _stateContext: Record<string, any> = {}) {
		this.stateMachine = stateMachine;
		this.name = this.constructor.name;
	}

	get entity(): Entity {
		return this.stateMachine.owner;
	}

	update(_deltaTime: number, _entity?: Entity, _entityManager?: any): void {
		// Override in subclasses
	}
}
