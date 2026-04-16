import { initState } from './States';
import type { Entity } from './Entity';
import type { BaseState } from './BaseState';

export class StateMachine {
	currentState: BaseState;
	context: Record<string, any>;
	owner: Entity;
	onEnter: (stateName: string) => void;

	constructor({
		owner,
		initialState,
		onEnter,
		context = {}
	}: {
		owner: Entity;
		states?: any;
		initialState: string;
		onEnter: (stateName: string) => void;
		context?: Record<string, any>;
	}) {
		this.owner = owner;
		this.onEnter = onEnter;
		this.context = context;

		this.onEnter(initialState);
		this.currentState = initState(this, owner.type, initialState, context);
	}

	update(deltaTime: number, entityManager?: any) {
		this.currentState.update(deltaTime, this.owner, entityManager);
	}

	setState(name: string, stateContext: Record<string, any> = {}) {
		if (name === this.currentState.name) return;

		this.onEnter(name);
		this.context = { ...this.context, ...stateContext };
		this.currentState = initState(this, this.owner.type, name, stateContext);
	}
}
