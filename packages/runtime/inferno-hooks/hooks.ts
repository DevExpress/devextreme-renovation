// Based on https://github.com/chrisdavies/xferno by Chris Davies

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  Component, SFC, ForwardRef as infernoForwardRefType, forwardRef as infernoForwardRef,
} from 'inferno';
import { equal } from './shallow-equal';
import { EffectsHost } from './effects_host';

export interface RefObject<T> {
  current: T | null;
}

export function forwardRef<T = Record<string, unknown>, P = Record<string, unknown>>(
  render: (props: T, ref: RefObject<P>) => InfernoElement<T>,
): SFC<T> & infernoForwardRefType {
  return infernoForwardRef(render) as SFC<T> & infernoForwardRefType;
}

let currentComponent: {
  getContextValue(consumer: { id: number }): any;
  getHook: (
    dependencies: number | unknown[] | undefined,
    hookInitialization: (hook: any, addEffectHook: (effect: ()=>void)=>void)=> void,
  ) => any;
  state: { [x: string]: any } | null;
  context: any;
};

function renderChild(component: HookContainer, {
  renderFn, renderProps, renderRef,
}: any, context: any) {
  const prevRecorder = currentComponent;
  currentComponent = component;
  currentComponent.context = context;
  const props = renderProps;
  try {
    return renderFn(props || {}, renderRef || {});
  } finally {
    currentComponent = prevRecorder;
  }
}

function createRecorder(component: HookContainer) {
  let nextId = 0;
  const hookInstances: Partial<Hook>[] = [];
  const effects: (()=>void)[] = [];

  let shouldUpdate = true;

  component.state = {};

  function nextHook() {
    const id = nextId;
    nextId += 1;
    let hook = hookInstances[id];

    if (!hook) {
      hook = {
        id,
      };
      hookInstances[id] = hook;
      hook.isNew = true;
    } else {
      hook.isNew = false;
    }

    return hook;
  }

  const addEffectHook = (effect: ()=>void) => { effects.push(effect); };
  const addHooksToQueue = () => {
    effects.forEach((effect) => {
      EffectsHost.addEffectHook(effect);
    });
  };
  const recorder = {
    renderResult: undefined,

    getHook(_dependencies: number | unknown[] | undefined,
      fn: (hook: Partial<Hook>, addEffectHook: (effect: ()=>void)=>void) => void) {
      const hook = nextHook();
      const value = hook.value;
      fn(hook, addEffectHook);
      shouldUpdate = shouldUpdate || !equal(hook.value, value);
      return hook.value;
    },

    shouldComponentUpdate(
      nextProps: { renderProps?: any; renderFn?: any },
      nextState: any,
      context: any,
    ) {
      shouldUpdate = !equal(component.props.renderProps, nextProps.renderProps);
      component.state = nextState;

      nextId = 0;

      const renderResult = renderChild(component, nextProps, context);

      if (shouldUpdate) {
        recorder.renderResult = renderResult;
      }

      return shouldUpdate;
    },

    componentDidMount: addHooksToQueue,

    componentDidUpdate: addHooksToQueue,

    dispose() {
      hookInstances.forEach((hook) => hook && hook.dispose && hook.dispose());
    },
  };

  return recorder;
}

export class HookContainer extends Component
  <{
    renderFn: (props: any, ref?: any) => JSX.Element,
    renderProps?: Record<string, unknown>,
    renderRef?: RefObject<Record<string, unknown>>,
  },
  Record<string, unknown>
  > {
  recorder!: ReturnType<typeof createRecorder> | undefined;

  // eslint-disable-next-line react/state-in-constructor
  state = {} as Record<string, unknown>;

  refs: any;

  componentWillMount(): void {
    EffectsHost.increment();
  }

  componentDidMount(): void {
    if (this.recorder) {
      this.recorder.componentDidMount();
    }
    EffectsHost.decrement();
  }

  shouldComponentUpdate(
    nextProps: Record<string, unknown>,
    nextState: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: Record<string, unknown> | undefined,
  ): boolean {
    if (!this.recorder) {
      return true;
    }
    const result = this.recorder.shouldComponentUpdate(nextProps, nextState, context);
    if (result) {
      EffectsHost.increment();
    }
    return result;
  }

  componentDidUpdate():void {
    if (this.recorder) {
      this.recorder.componentDidUpdate();
    }
    EffectsHost.decrement();
  }

  componentWillUnmount(): void {
    this.dispose();
  }

  getHook(dependencies: number | unknown[] | undefined, fn: any): any {
    if (!this.recorder) {
      this.recorder = createRecorder(this);
    }
    return this.recorder.getHook(dependencies, fn);
  }

  getContextValue(consumer: { id: number }): unknown {
    return this.context[consumer.id];
  }

  dispose(): void {
    if (this.recorder) {
      this.recorder.dispose();
    }
    this.state = {};
    this.recorder = undefined;
  }

  render(): JSX.Element {
    return this.recorder
      ? this.recorder.renderResult
      : renderChild(this, this.props as any, this.context);
  }
}

export interface Hook {
  isNew: boolean,
  id: string | number,
  $setState: (setter: any) => any,
  value: any,
  dispose: any,
  didMount: any,
  dependencies?: number | unknown[],
  effect?: ()=>void,
  newDeps?: number | unknown[],
}

export type SetStateAction<S> = S | ((prevState: S) => S);
export type Dispatch<A> = (value: A) => void;

export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  return currentComponent.getHook(
    0,
    (hook: Omit<Hook, 'dispose' | 'didMount'>) => {
      if (hook.isNew) {
        currentComponent.state![hook.id] = initialState instanceof Function
          ? initialState()
          : initialState;

        const component = currentComponent as HookContainer;
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

      hook.value = [currentComponent.state![hook.id], hook.$setState];
    },
  );
}

export function useEffect(fn: () => any, dependencies?: unknown[]) {
  return currentComponent.getHook(
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
  return currentComponent.getHook(dependencies, (hook: Hook) => {
    if (hook.isNew || !equal(hook.dependencies, dependencies) || hook.dependencies === undefined) {
      hook.value = fn();
      hook.dependencies = dependencies;
    }
  });
}

export function useCallback
  <T extends (...args: never[]) => unknown>(fn: T, dependencies: unknown[]): T {
  return currentComponent.getHook(dependencies, (hook: Hook) => {
    if (hook.isNew || !equal(hook.dependencies, dependencies) || hook.dependencies === undefined) {
      hook.value = fn;
      hook.dependencies = dependencies;
    }
  });
}

export function useImperativeHandle(ref: any, init: () => any, dependencies?: any): any {
  return currentComponent.getHook(dependencies, (hook: Partial<Hook>) => {
    if ((hook.isNew
       || !equal(hook.dependencies, dependencies)
        || hook.dependencies === undefined) && ref) {
      ref.current = init();
      hook.dependencies = dependencies;
    }
  });
}
export function useContext(consumer: { id: number, defaultValue: unknown }) {
  return currentComponent.getContextValue(consumer) || consumer.defaultValue;
}

export function useRef<T>(initialValue?: T | null) {
  return currentComponent.getHook(0,
    (hook: { isNew: boolean; value: unknown; dispose: unknown }) => {
      if (hook.isNew) {
        const ref = { current: initialValue || null };
        hook.value = ref;
        hook.dispose = () => { ref.current = null; };
      }
    });
}
