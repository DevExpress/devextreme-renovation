import { Component, findDOMfromVNode } from 'inferno';
import { InfernoEffect } from './effect';
import { InfernoEffectHost } from './effect_host';

const areObjectsEqual = (firstObject: any, secondObject: any) => {
  const bothAreObjects = firstObject instanceof Object && secondObject instanceof Object;
  if (!bothAreObjects) {
    return firstObject === secondObject;
  }

  const firstObjectKeys = Object.keys(firstObject);
  const secondObjectKeys = Object.keys(secondObject);
  if (firstObjectKeys.length !== secondObjectKeys.length) {
    return false;
  }

  const hasDifferentElement = firstObjectKeys.some(
    (key) => firstObject[key] !== secondObject[key],
  );
  return !hasDifferentElement;
};

export class BaseInfernoComponent<P = {}, S = {}> extends Component<P, S> {
  _pendingContext: any = this.context;

  componentWillReceiveProps(_: any, context: any) {
    this._pendingContext = context ?? {};
  }

  shouldComponentUpdate(nextProps: P, nextState: S) {
    return (
      !areObjectsEqual(this.props, nextProps)
      || !areObjectsEqual(this.state, nextState)
      || !areObjectsEqual(this.context, this._pendingContext)
    );
  }
}

export class InfernoComponent<P = {}, S = {}> extends BaseInfernoComponent<
P,
S
> {
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
      () => { this._effects = this.createEffects(); },
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

export class InfernoWrapperComponent<P = {}, S = {}> extends InfernoComponent<P, S> {
  vDomElement: Element | null = null;

  vDomPreviousClasses: string[] = [];

  vDomRemovedClasses: string[] = [];

  vDomAddedClasses: string[] = [];

  vDomUpdateClasses() {
    const currentClasses = this.vDomElement?.className.split(' ') ?? [];
    const addedClasses = currentClasses.filter((className) => this.vDomPreviousClasses.indexOf(className) < 0);
    const removedClasses = this.vDomPreviousClasses.filter((className) => currentClasses.indexOf(className) < 0);

    addedClasses.forEach((value) => {
      const indexInRemoved = this.vDomRemovedClasses.indexOf(value);
      if (indexInRemoved > -1) {
        this.vDomRemovedClasses.splice(indexInRemoved, 1);
      } else {
        this.vDomAddedClasses.push(value);
      }
    });

    removedClasses.forEach((value) => {
      const indexInAdded = this.vDomAddedClasses.indexOf(value);
      if (indexInAdded > -1) {
        this.vDomAddedClasses.splice(indexInAdded, 1);
      } else {
        this.vDomRemovedClasses.push(value);
      }
    });
  }

  componentDidMount() {
    super.componentDidMount();

    this.vDomElement = findDOMfromVNode(this.$LI, true);
    this.vDomPreviousClasses = this.vDomElement?.className.split(' ') ?? [];
  }

  componentDidUpdate() {
    super.componentDidUpdate();

    const element = this.vDomElement;

    if (element !== null) {
      this.vDomAddedClasses.forEach((className) => element.classList.add(className));
      this.vDomRemovedClasses.forEach((className) => element.classList.remove(className));
      this.vDomPreviousClasses = element.className.split(' ') ?? [];
    }
  }

  shouldComponentUpdate(nextProps: P, nextState: S) {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState);
    if (shouldUpdate) {
      this.vDomUpdateClasses();
    }
    return shouldUpdate;
  }
}
