import { useCallback, useEffect, useState } from 'react';

export class StoreBase {
	private listeners: Set<() => void> = new Set();
	private version = 0;

	subscribe = (cb: () => void) => {
		this.listeners.add(cb);
		return () => this.listeners.delete(cb);
	};

	protected emitChange() {
		this.version++;
		for (const cb of Array.from(this.listeners)) cb();
	}

	getVersion() {
		return this.version;
	}
}

export function useStore<T extends StoreBase>(store: T): T {
	const [, forceUpdate] = useState(0);

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			forceUpdate(n => n + 1);
		});
		return unsubscribe;
	}, [store]);

	return store;
}

export function useStoreValue<T extends StoreBase, V>(store: T, selector: (store: T) => V): V {
	const [value, setValue] = useState(() => selector(store));

	useEffect(() => {
		const update = () => {
			setValue(selector(store));
		};
		update();
		return store.subscribe(update);
	}, [store, selector]);

	return value;
}
