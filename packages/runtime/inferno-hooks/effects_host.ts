import type { Hook } from './hooks';

let counter = 0;
let hooks: Hook[] = [];
const allHooks: Hook[] = [];
const addEffectHook = (hook: Hook): void => { hooks.push(hook); };
const decrement = () => { counter--; if (counter === 0) callEffects(); };
const increment = () => { counter++; };
const getByComponent = (component: any): Hook[] => allHooks
  // eslint-disable-next-line eqeqeq
  .filter((hook) => hook.component == component);
const addAllHooks = (hook:Hook):void => { allHooks.push(hook); };

const callEffects = () => {
  hooks.forEach((hook) => {
    if (hook.isNew) {
      hook.dispose = hook.effect?.();
      hook.isNew = false;
    } else if (!hook.dependenciesEqual) {
      hook.dispose?.();
      hook.dispose = hook.effect?.();
    }
  });
  hooks = [];
};
export const EffectsHost = {
  increment, decrement, addEffectHook, getByComponent, addAllHooks,
};
