export interface AnimationConfig {
	name: string;
	framesAmount: number;
	frameRate: number;
	loop?: boolean;
	frames?: string[];
}

export class Animation {
	name: string;
	framesAmount: number;
	frameRate: number;
	loop: boolean;
	currentFrame: number;
	currentFrameTime: number;
	frames: string[];
	onFrameChange: (frame: number) => void;

	constructor({ name, framesAmount, frameRate, loop = false, frames = [] }: AnimationConfig) {
		this.name = name;
		this.framesAmount = framesAmount;
		this.frameRate = frameRate;
		this.loop = loop;
		this.currentFrame = 0;
		this.currentFrameTime = 0;
		this.frames = frames;
		this.onFrameChange = () => {};
	}

	get isComplete(): boolean {
		if (this.loop) {
			return false;
		}
		return this.currentFrame === this.framesAmount - 1;
	}

	update(deltaTime: number) {
		if (this.frameRate === 0) return;

		this.currentFrameTime += deltaTime;

		if (this.currentFrameTime >= 1000 / this.frameRate) {
			this.currentFrameTime = 0;
			this.nextFrame();
		}
	}

	nextFrame() {
		this.onFrameChange(this.currentFrame);

		if (this.currentFrame >= this.framesAmount - 1) {
			if (this.loop) {
				this.currentFrame = 0;
			} else {
				this.currentFrame = this.framesAmount - 1;
			}
		} else {
			this.currentFrame += 1;
		}
	}

	getCurrentFramePath(): string | null {
		if (this.frames && this.frames.length > 0) {
			return this.frames[this.currentFrame] || this.frames[0];
		}
		return null;
	}
}
