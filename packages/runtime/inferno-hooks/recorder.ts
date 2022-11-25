import type { Hook } from './hooks';
import { EffectsHost } from './effects_host';
import { equal } from './shallow-equal';
import type { HookContainer } from './container';

export const currentComponent: {
  current: {
    getContextValue(consumer: { id: number }): any;
    getHook: (
      dependencies: number | unknown[] | undefined,
      hookInitialization: (hook: any, addEffectHook: (effect: () => void) => void) => void,
    ) => any;
    state: { [x: string]: any } | null;
    context: any;
  }
} = {} as any;

export function renderChild(component: HookContainer, {
  renderFn, renderProps, renderRef,
}: any, context: any) {
  const prevRecorder = currentComponent.current;
  currentComponent.current = component;
  currentComponent.current.context = context;
  const props = renderProps;
  try {
    return renderFn(props || {}, renderRef || {});
  } finally {
    currentComponent.current = prevRecorder;
  }
}

export function createRecorder(component: HookContainer): {
  renderResult: undefined;
  getHook(
    _dependencies: number | unknown[] | undefined,
    fn: (hook: Partial<Hook>, addEffectHook: (effect: () => void) => void) => void): any;
  shouldComponentUpdate(
    nextProps: { renderProps?: any; renderFn?: any; },
    nextState: any, context: any): boolean;
  componentDidMount: () => void; componentDidUpdate: () => void; dispose(): void;
} {
  let nextId = 0;
  const hookInstances: Partial<Hook>[] = [];
  const effects: (() => void)[] = [];

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

  const addEffectHook = (effect: () => void) => { effects.push(effect); };
  const addHooksToQueue = () => {
    effects.forEach((effect) => {
      EffectsHost.addEffectHook(effect);
    });
  };
  const recorder = {
    renderResult: undefined,

    getHook(_dependencies: number | unknown[] | undefined,
      fn: (hook: Partial<Hook>, addEffectHook: (effect: () => void) => void) => void) {
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
      shouldUpdate = component.props.pure
        ? (!equal(component.props.renderProps, nextProps.renderProps)
        || !equal(component.state, nextState)) : true;

      component.state = nextState;

      nextId = 0;

      if (shouldUpdate) {
        const renderResult = renderChild(component, nextProps, context);
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
