// Based on https://github.com/chrisdavies/xferno by Chris Davies

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  Component, SFC, ForwardRef as infernoForwardRef,
} from 'inferno';
import { equal } from './shallow-equal';

export interface RefObject<T> {
  current: T | null;
}

export function forwardRef<T = Record<string, unknown>, P = Record<string, unknown>>(
  render: (props: T, ref: RefObject<P>) => InfernoElement<T>,
): SFC<T> & infernoForwardRef {
  return forwardRef(render);
}

let currentComponent: {
  getContextValue(consumer: { id: number }): any;
  getHook: (
    arg0: number | unknown[], arg1: { (hook: any): void; (hook: any): void; (hook: any): void }
  ) => any;
  state: { [x: string]: any } | null;
};

function renderChild(component: HookComponent, {
  renderFn, renderProps, renderRef,
}: any) {
  const prevRecorder = currentComponent;
  currentComponent = component;
  const props = renderProps;
  try {
    return renderFn(props || {}, renderRef || {});
  } finally {
    currentComponent = prevRecorder;
  }
}

function createRecorder(component: HookComponent) {
  let nextId = 0;
  const hookInstances: Partial<Hook>[] = [];

  let shouldUpdate = true;

  component.state = {};

  function nextHook(dependencies: number | unknown[]) {
    const id = nextId;
    nextId += 1;
    let hook = hookInstances[id];

    if (hook && equal(hook.dependencies, dependencies)) {
      hook.isNew = false;
      return hook;
    }

    if (hook && hook.dispose) {
      hook.dispose();
    }

    hook = {
      id,
      isNew: true,
      dependencies,
      didMount: hook && hook.didMount,
    };

    hookInstances[id] = hook;
    return hook;
  }

  const recorder = {
    renderResult: undefined,

    getHook(dependencies: number | unknown[], fn: (arg0: any) => void) {
      const hook = nextHook(dependencies);
      const value = hook.value;
      fn(hook);
      shouldUpdate = shouldUpdate || !equal(hook.value, value);
      return hook.value;
    },

    shouldComponentUpdate(
      nextProps: { renderProps?: any; renderFn?: any },
      nextState: any,
    ) {
      shouldUpdate = !equal(component.props.renderProps, nextProps.renderProps);
      component.state = nextState;

      nextId = 0;

      const renderResult = renderChild(component, nextProps);

      if (shouldUpdate) {
        recorder.renderResult = renderResult;
      }

      return shouldUpdate;
    },

    dispose() {
      hookInstances.forEach((hook) => hook && hook.dispose && hook.dispose());
    },
    didMount() {
      hookInstances.forEach((hook) => {
        if (hook.didMount) {
          hook.didMount(); hook.didMount = true;
        }
      });
    },
  };

  return recorder;
}

export class HookComponent extends Component
  <{
    renderFn: (props: any) => JSX.Element,
    renderProps?: Record<string, unknown>,
    renderRef?: RefObject<Record<string, unknown>>,
  },
  Record<string, unknown>
  > {
  recorder!: ReturnType<typeof createRecorder> | undefined;

  // eslint-disable-next-line react/state-in-constructor
  state = {} as Record<string, unknown>;

  refs: any;
  // constructor(props: any) {
  //   super(props);
  //   this.state = null;
  // }

  componentDidMount(): void {
    if (this.recorder) {
      this.recorder.didMount();
    }
  }

  UNSAFE_componentWillReceiveProps({ renderFn }: { renderFn: () => JSX.Element }): void {
    if (renderFn !== this.props.renderFn) {
      this.dispose();
    }
  }

  shouldComponentUpdate(
    nextProps: Record<string, unknown>,
    nextState: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: Record<string, unknown> | undefined,
  ): boolean {
    if (!this.recorder) {
      return true;
    }

    return this.recorder.shouldComponentUpdate(nextProps, nextState);
  }

  componentWillUnmount(): void {
    this.dispose();
  }

  getHook(dependencies: number | unknown[], fn: any): any {
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
      : renderChild(this, this.props as any);
  }
}

interface Hook {
  isNew: boolean,
  id: string | number,
  $setState: (setter: any) => any,
  value: any,
  dispose: any,
  didMount: any,
  dependencies: number | unknown[]
}

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  return currentComponent.getHook(
    0,
    (hook: Omit<Hook, 'dispose' | 'didMount'>) => {
      if (hook.isNew) {
        currentComponent.state![hook.id] = initialState instanceof Function
          ? initialState()
          : initialState;

        const component = currentComponent as HookComponent;
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
    dependencies || [],
    (hook: { isNew: any; dispose: any; didMount: any }) => {
      if (hook.isNew) {
        if (hook.didMount) {
          hook.dispose = fn();
        } else {
          hook.didMount = () => {
            hook.dispose = fn();
          };
        }
      }
    },
  );
}

export function useMemo<T>(fn: () => T, dependencies: unknown[]): T {
  return currentComponent.getHook(dependencies, (hook: { isNew: boolean; value: any }) => {
    if (hook.isNew) {
      hook.value = fn();
    }
  });
}

export function useCallback
  <T extends (...args: never[]) => unknown>(fn: T, dependencies: unknown[]): T {
  return currentComponent.getHook(dependencies, (hook: { isNew: boolean; value: any }) => {
    if (hook.isNew) {
      hook.value = fn;
    }
  });
}

export function useImperativeHandle(ref: any, init: () => any, dependencies?: any): any {
  return currentComponent.getHook(dependencies, (hook: { isNew: boolean; value: any }) => {
    if (hook.isNew && ref) {
      ref.current = init();
    }
  });
}
export function useContext(consumer: { id: number }) {
  return currentComponent.getContextValue(consumer);
}

export function useRef<T>(initialValue: T | null) {
  return currentComponent.getHook(0,
    (hook: { isNew: boolean; value: unknown; dispose: unknown }) => {
      if (hook.isNew) {
        const ref = { current: initialValue || null };
        hook.value = ref;
        hook.dispose = () => { ref.current = null; };
      }
    });
}
