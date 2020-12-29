import { Component } from "inferno";
import { InfernoEffect } from "./effect";
import { InfernoEffectHost } from "./effect_host";

export class InfernoComponent<P = {}, S = {}> extends Component<P, S> {
  _effects: InfernoEffect[] = [];

  createEffects(): InfernoEffect[] {
    return [];
  }

  updateEffects() {}

  componentWillMount() {
    InfernoEffectHost.lock();
  }

  componentWillUpdate() {
    InfernoEffectHost.lock();
  }

  componentDidMount() {
    InfernoEffectHost.callbacks.push(
      () => (this._effects = this.createEffects())
    );
    InfernoEffectHost.callEffects();
  }

  componentDidUpdate() {
    InfernoEffectHost.callbacks.push(() => this.updateEffects());
    InfernoEffectHost.callEffects();
  }

  componentWillUnmount() {
    this._effects.forEach((e) => e.dispose());
  }
}
