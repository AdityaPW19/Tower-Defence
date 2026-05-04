const computeBase = (): string => {
	const baseFromImportMeta =
		typeof import.meta !== 'undefined' && (import.meta as any).env
			? (import.meta as any).env.BASE_URL
			: undefined;
	const baseFromProcess =
		typeof process !== 'undefined' && (process as any).env
			? (process as any).env.PUBLIC_URL
			: undefined;
	const base = baseFromImportMeta ?? baseFromProcess ?? '';
	return base.endsWith('/') ? base.slice(0, -1) : base;
};

const NORMALIZED_BASE = computeBase();

const pathCache = new Map<string, string>();

export const resolvePath = (path: string): string => {
	if (!path) return NORMALIZED_BASE;
	const cached = pathCache.get(path);
	if (cached !== undefined) return cached;
	const resolved = path.startsWith('/')
		? `${NORMALIZED_BASE}${path}`
		: `${NORMALIZED_BASE}/${path}`;
	pathCache.set(path, resolved);
	return resolved;
};
