const KEY = 'td.tutorial.seen.v1';

export const getTutorialSeen = (): boolean => {
	try {
		return typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1';
	} catch {
		return false;
	}
};

export const setTutorialSeen = (value: boolean): void => {
	try {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(KEY, value ? '1' : '0');
	} catch {
		// silently ignore (private mode, etc.)
	}
};
