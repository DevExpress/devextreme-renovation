export const InfernoEffectHost: {
  owner: any;
  callbacks: Array<() => void>;
  callEffects: (component: any) => void;
} = {
  owner: null,
  callbacks: [],
  callEffects(component: any) {
    if (component === this.owner) {
      const effects = this.callbacks;
      this.owner = null;
      this.callbacks = [];
      effects.forEach((callback) => callback());
    }
  },
};
