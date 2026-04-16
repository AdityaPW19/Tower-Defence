import { StoreBase } from './storeShim';

export class Particle {
	x = 0;
	y = 0;
	vx = 0;
	vy = 0;
	life = 1.0;
	color = '#ff0000';
	size = 5;
	decay = 0.05;

	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;

		const angle = Math.random() * Math.PI * 2;
		const speed = Math.random() * 5 + 2;
		this.vx = Math.cos(angle) * speed;
		this.vy = Math.sin(angle) * speed;
		this.size = Math.random() * 6 + 4;
		this.decay = Math.random() * 0.03 + 0.02;
	}

	update(_dt: number) {
		this.x += this.vx;
		this.y += this.vy;
		this.life -= this.decay;
		this.size *= 0.95;
	}
}

export class ParticleManager extends StoreBase {
	particles: Particle[] = [];

	update(dt: number) {
		this.particles = this.particles.filter((p) => p.life > 0);
		for (const p of this.particles) p.update(dt);
		this.emitChange();
	}

	spawnExplosion(x: number, y: number, color: string = '#ff4400', count: number = 10) {
		for (let i = 0; i < count; i++) {
			this.particles.push(new Particle(x, y, color));
		}
		this.emitChange();
	}

	reset() {
		this.particles = [];
		this.emitChange();
	}

}

export const particleManager = new ParticleManager();
