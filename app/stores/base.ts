import { create, StoreApi, UseBoundStore } from "zustand";
import { combine, persist, subscribeWithSelector } from "zustand/middleware";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

export type Updater<T> = (updater: (value: T) => void) => void;

export function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj));
}

export function ensure<T extends object>(
  obj: T,
  keys: Array<[keyof T][number]>,
) {
  return keys.every(
    (k) => obj[k] !== undefined && obj[k] !== null && obj[k] !== "",
  );
}

type SecondParam<T> = T extends (
    _f: infer _F,
    _s: infer S,
    ...args: infer _U
  ) => any
  ? S
  : never;

export type MakeUpdater<T> = {
  lastUpdateTime: number;

  markUpdate: () => void;
  update: Updater<T>;
};

type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

function combineState<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
) {
  return combine(
    {
      ...state,
      lastUpdateTime: 0,
    },
    (set, get) => {
      return {
        ...methods(set as any, get as any),

        markUpdate() {
          set({ lastUpdateTime: Date.now() } as Partial<
            T & M & MakeUpdater<T>
          >);
        },
        update(updater) {
          const state = deepClone(get());
          updater(state);
          set({
            ...state,
            lastUpdateTime: Date.now(),
          });
        },
      } as M & MakeUpdater<T>;
    },
  );
}

export function createPersistStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  return create(
    persist(
      combineState(state, methods),
      persistOptions as any,
    ),
  );
}

export function createSubStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  return create(
    persist(
      subscribeWithSelector(
        combineState(state, methods),
      ),
      persistOptions as any,
    ),
  )
}

export function createMemSubStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
) {
  return create(
    subscribeWithSelector(
      combineState(state, methods),
    )
  )
}
