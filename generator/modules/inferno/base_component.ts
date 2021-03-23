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

export class BaseInfernoComponent<P = {}, S = {}> extends Component<P, S> {
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

type WrapperProps<Props> = Props & {
  $element: Element | null | undefined;
};
export class InfernoComponentWrapper<
  P extends WrapperProps<{}>,
  S = {}
> extends InfernoComponent<P, S> {
  initialDxStyles: string[] = [];
  pendingClasses: string[] = [];

  getInitialClasses() {
    return (this.props.$element?.getAttribute("class") || "")
      .split(" ")
      .filter((name) => name.startsWith("dx-"));
  }

  getCustomClasses() {
    return (this.props.$element?.getAttribute("class") || "")
      .split(" ")
      .filter((name) => !name.startsWith("dx-"));
  }

  componentWillMount() {
    super.componentWillMount();

    this.initialDxStyles = this.getInitialClasses();
  }

  shouldComponentUpdate(nextProps: P, nextState: S) {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState);

    if (shouldUpdate) {
      this.pendingClasses = this.getCustomClasses();
    }
    return shouldUpdate;
  }

  componentDidMount() {
    super.componentDidMount();

    const additionalClasses = this.initialDxStyles.concat(this.pendingClasses);
    if (additionalClasses) {
      this.props.$element?.classList.add(...additionalClasses);
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate();

    const additionalClasses = this.initialDxStyles.concat(this.pendingClasses);
    if (additionalClasses) {
      this.props.$element?.classList.add(...additionalClasses);
    }
  }
}
