import { resolvePath } from '../utils/paths';

export const cursors = {
	arrow: resolvePath('/cursors/cursor-arrow.svg'),
	hammer: resolvePath('/cursors/cursor-hammer.svg')
};

export class Cursor {
	inAnimation = false;

	get arrow() {
		return `url(${cursors.arrow}), auto`;
	}

	get hammer() {
		return `url(${cursors.hammer}), auto`;
	}

	get(name: 'arrow' | 'hammer') {
		return this[name];
	}
}

export const cursor = new Cursor();
