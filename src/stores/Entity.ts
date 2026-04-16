import { StoreBase } from './storeShim';
import { Vector2 } from './Vector2';
import { StateMachine } from './StateMachine';
import { Animation } from './Animation';
import { getAnimation } from '../config/animations';

export type EntityType = 'enemy' | 'tower' | 'throne' | 'loot' | 'projectile' | 'unknown';

export interface EntityConfig {
	offsetPosition?: Vector2 | null;
	staticSlot?: any;
	width?: number;
	height?: number;
	scale?: number;
	rotation?: number;
	type: EntityType;
	states?: any;
	initialState: string;
	onCollide?: (entity: Entity, other: Entity) => void;
	stats?: Record<string, any>;
	upgradeLevel?: number;
	upgrades?: ((entity: Entity) => void)[];
	vfx?: string[];
	effects?: ((entity: Entity) => void)[];
	stateToAnimation?: Record<string, string>;
}

export class Entity extends StoreBase {
	static lastId = 0;
	id: number;
	name: string;
	type: EntityType;
	position: Vector2;
	offsetPosition: Vector2 | null = null;
	staticSlot: any = null;
	width: number;
	height: number;
	scale: number;
	rotation: number;
	opacity: number = 1;
	isInteractable: boolean = true;
	isDestroyed: boolean = false;

	state: StateMachine | null = null;
	animation: Animation | null = null;
	stats: Record<string, any>;
	stateToAnimation: Record<string, string>;
	upgradeLevel: number;
	upgrades: ((entity: Entity) => void)[];
	vfx: string[];
	effects: ((entity: Entity) => void)[];

	onCollide: (other: Entity) => void = () => {};

	constructor(
		name: string,
		position: Vector2,
		config: EntityConfig,
		context: Record<string, any> = {}
	) {
		super();
		this.id = Entity.lastId++;
		this.name = name;
		this.type = config.type || 'unknown';
		this.width = config.width || 64;
		this.height = config.height || 64;
		this.scale = config.scale || 1;
		this.rotation = config.rotation || 0;
		this.position = position.clone();
		this.offsetPosition = config.offsetPosition || null;
		this.staticSlot = config.staticSlot || null;

		this.stats = { ...config.stats };
		this.upgradeLevel = config.upgradeLevel ?? -1;
		this.upgrades = config.upgrades || [];
		this.vfx = config.vfx || [];
		this.effects = config.effects || [];
		this.stateToAnimation = config.stateToAnimation || {};

		if (config.onCollide) {
			this.onCollide = (other: Entity) => config.onCollide!(this, other);
		}

		const onStateEnter = (stateName: string) => {
			if (this.stateToAnimation[stateName]) {
				this.setAnimation(stateName);
			}
		};

		this.state = new StateMachine({
			owner: this,
			states: config.states,
			initialState: config.initialState,
			onEnter: onStateEnter,
			context
		});
	}

	get boundingBox() {
		const x1 = this.position.x;
		const y1 = this.position.y;
		const x2 = this.position.x + this.width;
		const y2 = this.position.y + this.height;

		return {
			x1,
			y1,
			x2,
			y2,
			center: new Vector2(x1 + this.width / 2, y1 + this.height / 2),
			topMiddle: new Vector2(x1 + this.width / 2, y2)
		};
	}

	get isUpgradable(): boolean {
		return this.upgrades.length > 0 && this.upgradeLevel < this.upgrades.length;
	}

	update(deltaTime: number) {
		if (this.isDestroyed) return;

		if (this.state) {
			this.state.update(deltaTime);
		}

		this.effects.forEach((effectFn) => {
			effectFn(this);
		});

		if (this.animation) {
			this.animation.update(deltaTime);
		}

		this.emitChange();
	}

	setPosition(position: Vector2) {
		this.position = position;
		this.emitChange();
	}

	setAnimation(stateName: string) {
		const animName = this.stateToAnimation[stateName];
		if (!animName) return;

		try {
			const animationConfig = getAnimation(animName);
			this.animation = new Animation({ ...animationConfig, name: animName });
		} catch (e) {
			console.warn(`Animation not found: ${animName}`);
		}
	}

	addEffect(effectFn: (entity: Entity) => void) {
		if (!this.effects.includes(effectFn)) {
			this.effects = [...this.effects, effectFn];
		}
	}

	removeEffect(effectFn: (entity: Entity) => void) {
		this.effects = this.effects.filter((e) => e !== effectFn);
	}

	cleanEffects() {
		this.effects = [];
	}

	addVFX(effect: string) {
		if (!this.vfx.includes(effect)) {
			this.vfx = [...this.vfx, effect];
			this.emitChange();
		}
	}

	removeVFX(effect: string) {
		this.vfx = this.vfx.filter((e) => e !== effect);
		this.emitChange();
	}

	cleanVFX() {
		this.vfx = [];
		this.emitChange();
	}

	takeDamage(damage: number) {
		this.stats.health -= damage;
		if (this.stats.health <= 0) {
			this.state?.setState('Die');
		}
		this.emitChange();
	}

	stopInteractions() {
		this.isInteractable = false;
		this.emitChange();
	}

	removeCollider() {
		this.onCollide = () => {};
	}

	destroy() {
		this.isDestroyed = true;
		this.isInteractable = false;
		this.emitChange();
	}

	getSnapshot() {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			position: { x: this.position.x, y: this.position.y },
			width: this.width,
			height: this.height,
			scale: this.scale,
			rotation: this.rotation,
			opacity: this.opacity,
			isInteractable: this.isInteractable,
			isDestroyed: this.isDestroyed,
			stateName: this.state?.currentState?.name || 'Unknown',
			stats: this.stats,
			upgradeLevel: this.upgradeLevel,
			vfx: this.vfx,
			animationFrame: this.animation?.currentFrame || 0,
			animationName: this.animation?.name || null
		};
	}
}
