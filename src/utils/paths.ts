export const resolvePath = (path: string) => {
	// Prefer Vite's import.meta.env.BASE_URL when available in the browser build
	// Fallback to process.env.PUBLIC_URL (for non-Vite builds) or empty string
	const baseFromImportMeta = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.BASE_URL : undefined;
	const baseFromProcess = typeof process !== 'undefined' && (process as any).env ? (process as any).env.PUBLIC_URL : undefined;
	const base = baseFromImportMeta ?? baseFromProcess ?? '';
	if (!path) return base;
	// Ensure we don't accidentally double up slashes
	const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
	return path.startsWith('/') ? `${normalizedBase}${path}` : `${normalizedBase}/${path}`;
};
