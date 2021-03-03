import { Component } from "inferno";
import { InfernoEffect } from "./effect";
import { InfernoEffectHost } from "./effect_host";

const areObjectsEqual = (firstObject: any, secondObject: any) => {
  const bothAreObjects =
    firstObject instanceof Object && secondObject instanceof Object;
  if (!bothAreObjects) {
    return firstObject === secondObject;
  }

  const firstObjectKeys = Object.keys(firstObject);
  const secondObjectKeys = Object.keys(secondObject);
  if (firstObjectKeys.length !== secondObjectKeys.length) {
    return false;
  }

  const hasDifferentElement = firstObjectKeys.some(
    (key) => firstObject[key] !== secondObject[key]
  );
  return !hasDifferentElement;
};

export class InfernoComponent<P = {}, S = {}> extends Component<P, S> {
  _effects: InfernoEffect[] = [];
  _pendingContext: any = this.context;

  componentWillReceiveProps(_: any, context: any) {
    this._pendingContext = context ?? {};
  }
  shouldComponentUpdate(nextProps: P, nextState: S) {
    return (
      !areObjectsEqual(this.props, nextProps) ||
      !areObjectsEqual(this.state, nextState) ||
      !areObjectsEqual(this.context, this._pendingContext)
    );
  }

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

  destroyEffects() {
    this._effects.forEach((e) => e.dispose());
  }

  componentWillUnmount() {
    this.destroyEffects();
  }
}
