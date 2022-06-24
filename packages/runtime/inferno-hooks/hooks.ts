// Based on https://github.com/chrisdavies/xferno by Chris Davies

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { equal } from './shallow-equal';
import { currentComponent } from './recorder';
import type { HookContainer } from './container';

export interface Hook {
  isNew: boolean,
  id: string | number,
  $setState: (setter: any) => any,
  value: any,
  dispose: any,
  didMount: any,
  dependencies?: number | unknown[],
  effect?: () => void,
  newDeps?: number | unknown[],
}

export type SetStateAction<S> = S | ((prevState: S) => S);
export type Dispatch<A> = (value: A) => void;

export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  return currentComponent.current.getHook(
    0,
    (hook: Omit<Hook, 'dispose' | 'didMount'>) => {
      if (hook.isNew) {
        currentComponent.current.state![hook.id] = initialState instanceof Function
          ? initialState()
          : initialState;

        const component = currentComponent.current as HookContainer;
        hook.$setState = (setter: (arg0: any) => any) => {
          const state = component.state![hook.id];
          const nextState = typeof setter === 'function' ? setter(component.state![hook.id]) : setter;

          if (state === nextState) {
            return undefined;
          }
          return component.setState((s: { [x: string]: any }) => {
            s[hook.id] = nextState;
            return s;
          });
        };
      }

      hook.value = [currentComponent.current.state![hook.id], hook.$setState];
    },
  );
}

export function useEffect(fn: () => any, dependencies?: unknown[]) {
  return currentComponent.current.getHook(
    dependencies,
    (hook: Hook, addEffectHook) => {
      hook.effect = fn;
      if (hook.isNew) {
        addEffectHook(() => {
          if (hook.isNew) {
            hook.dispose = hook.effect?.();
            hook.dependencies = dependencies;
          } else if (hook.dependencies === undefined || !equal(hook.dependencies, hook.newDeps)) {
            hook.dispose?.();
            hook.dispose = hook.effect?.();
            hook.dependencies = hook.newDeps;
          }
        });
      } else {
        hook.newDeps = dependencies;
      }
    },
  );
}

export function useMemo<T>(fn: () => T, dependencies: unknown[]): T {
  return currentComponent.current.getHook(dependencies, (hook: Hook) => {
    if (hook.isNew || !equal(hook.dependencies, dependencies) || hook.dependencies === undefined) {
      hook.value = fn();
      hook.dependencies = dependencies;
    }
  });
}

export function useCallback
  <T extends (...args: never[]) => unknown>(fn: T, dependencies: unknown[]): T {
  return currentComponent.current.getHook(dependencies, (hook: Hook) => {
    if (hook.isNew || !equal(hook.dependencies, dependencies) || hook.dependencies === undefined) {
      hook.value = fn;
      hook.dependencies = dependencies;
    }
  });
}

export function useImperativeHandle(ref: any, init: () => any, dependencies?: any): any {
  return currentComponent.current.getHook(dependencies, (hook: Partial<Hook>) => {
    if ((hook.isNew
      || !equal(hook.dependencies, dependencies)
      || hook.dependencies === undefined) && ref) {
      ref.current = init();
      hook.dependencies = dependencies;
    }
  });
}
export function useContext(consumer: { id: number, defaultValue: unknown }) {
  return currentComponent.current.getContextValue(consumer) || consumer.defaultValue;
}

export function useRef<T>(initialValue?: T | null) {
  return currentComponent.current.getHook(0,
    (hook: { isNew: boolean; value: unknown; dispose: unknown }) => {
      if (hook.isNew) {
        const ref = { current: initialValue || null };
        hook.value = ref;
        hook.dispose = () => { ref.current = null; };
      }
    });
}
