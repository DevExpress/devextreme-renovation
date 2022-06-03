let counter = 0;
let queue: (()=>void)[] = [];

const addEffectHook = (effect: ()=>void): void => { queue.push(effect); };
const decrement = () => { counter--; if (counter === 0) callEffects(); };
const increment = () => { counter++; };

const callEffects = () => {
  queue.forEach((effect) => {
    effect();
  });
  queue = [];
};
export const EffectsHost = {
  increment, decrement, addEffectHook,
};
