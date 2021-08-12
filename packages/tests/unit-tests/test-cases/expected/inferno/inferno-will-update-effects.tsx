import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";

export declare type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class InheritedFromInfernoComponent extends InfernoComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.someEffect = this.someEffect.bind(this);
  }

  _hovered!: Boolean;

  createEffects() {
    return [new InfernoEffect(this.someEffect, [])];
  }
  updateEffects() {
    this._effects[0]?.update([]);
  }

  someEffect(): any {}
  get someGetter(): any {
    if (this.__getterCache["someGetter"] !== undefined) {
      return this.__getterCache["someGetter"];
    }
    return (this.__getterCache["someGetter"] = ((): any => {
      return this.state._hovered;
    })());
  }
  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { ...restProps } = this.props as any;
      return restProps;
    })());
  }
  __getterCache: {
    someGetter?: any;
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.state["_hovered"] !== nextState["_hovered"]) {
      this.__getterCache["someGetter"] = undefined;
    }
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

InheritedFromInfernoComponent.defaultProps = SomeProps;
