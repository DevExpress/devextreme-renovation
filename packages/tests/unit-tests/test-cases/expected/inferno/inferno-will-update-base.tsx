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

export default class InheritedFromBaseComponent extends BaseInfernoComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  _hovered!: Boolean;

  updateState(): any {
    this.setState((__state_argument: any) => ({
      _hovered: !__state_argument._hovered,
    }));
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
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

InheritedFromBaseComponent.defaultProps = SomeProps;
