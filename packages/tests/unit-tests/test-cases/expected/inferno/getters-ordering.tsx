import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";

export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
};
const view = () => <div></div>;

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

class Widget extends InfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.g3 = this.g3.bind(this);
    this.someEffect = this.someEffect.bind(this);
  }

  createEffects() {
    return [
      new InfernoEffect(this.someEffect, [
        this.props.someProp,
        this.props.type,
      ]),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([this.props.someProp, this.props.type]);
  }

  someEffect(): any {
    return () => this.g7;
  }
  get g7(): any {
    return this.g6;
  }
  get g5(): (string | undefined)[] {
    if (this.__getterCache["g5"] !== undefined) {
      return this.__getterCache["g5"];
    }
    return (this.__getterCache["g5"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.g2];
    })());
  }
  get g1(): any {
    return this.props.someProp;
  }
  get g2(): any {
    return this.props.type;
  }
  get g4(): (string | undefined)[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): (string | undefined)[] => {
      return [...this.g3(), this.g1];
    })());
  }
  get g6(): (string | undefined)[] {
    if (this.__getterCache["g6"] !== undefined) {
      return this.__getterCache["g6"];
    }
    return (this.__getterCache["g6"] = ((): (string | undefined)[] => {
      return [...this.g5, ...this.g4];
    })());
  }
  get restAttributes(): RestProps {
    const { someProp, type, ...restProps } = this.props as any;
    return restProps;
  }
  g3(): (string | undefined)[] {
    return [this.g1, this.g2];
  }
  __getterCache: {
    g5?: (string | undefined)[];
    g4?: (string | undefined)[];
    g6?: (string | undefined)[];
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (
      this.props["someProp"] !== nextProps["someProp"] ||
      this.props["type"] !== nextProps["type"]
    ) {
      this.__getterCache["g5"] = undefined;
    }
    if (
      this.props["someProp"] !== nextProps["someProp"] ||
      this.props["type"] !== nextProps["type"]
    ) {
      this.__getterCache["g4"] = undefined;
    }
    if (
      this.props["someProp"] !== nextProps["someProp"] ||
      this.props["type"] !== nextProps["type"]
    ) {
      this.__getterCache["g6"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = WidgetProps;
