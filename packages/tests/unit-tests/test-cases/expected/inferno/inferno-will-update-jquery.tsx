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
import { createReRenderEffect } from "@devextreme/vdom";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class InheritedFromInfernoWrapperComponent extends InfernoWrapperComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
  }

  _hovered!: Boolean;

  createEffects() {
    return [createReRenderEffect()];
  }

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

InheritedFromInfernoWrapperComponent.defaultProps = SomeProps;
