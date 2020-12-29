import { Component } from "inferno";
import { InfernoEffect } from "./effect";
import { InfernoEffectHost } from "./effect_host";

export class InfernoComponent<P = {}, S = {}> extends Component<P, S> {
  _effects: InfernoEffect[] = [];

  createEffects(): InfernoEffect[] {
    return [];
  }

  updateEffects() {}

  setEffectOwner() {
    if (InfernoEffectHost.owner === null) {
      InfernoEffectHost.owner = this;
    }
  }

  componentWillMount() {
    this.setEffectOwner();
  }

  componentWillUpdate() {
    this.setEffectOwner();
  }

  componentDidMount() {
    InfernoEffectHost.callbacks.push(
      () => (this._effects = this.createEffects())
    );
    InfernoEffectHost.callEffects(this);
  }

  componentDidUpdate() {
    InfernoEffectHost.callbacks.push(() => this.updateEffects());
    InfernoEffectHost.callEffects(this);
  }

  componentWillUnmount() {
    this._effects.forEach((e) => e.dispose());
  }
}
