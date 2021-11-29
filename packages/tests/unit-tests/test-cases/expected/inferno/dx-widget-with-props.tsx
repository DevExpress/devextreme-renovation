import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}

export declare type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
  number?: number;
  onClick?: (e: any) => void;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: "default text",
  number: 42,
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class WidgetWithProps extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.doSomething = this.doSomething.bind(this);
  }

  get restAttributes(): RestProps {
    const { number, onClick, optionalValue, value, ...restProps } = this
      .props as any;
    return restProps;
  }
  doSomething(): any {}

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as WidgetWithProps);
  }
}

WidgetWithProps.defaultProps = WidgetWithPropsInput;

import { createElement as h } from "inferno-compat";
import { createReRenderEffect } from "@devextreme/runtime/inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class PublicWidgetWithProps extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.doSomething = this.doSomething.bind(this);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get restAttributes(): RestProps {
    const { number, onClick, optionalValue, value, ...restProps } = this
      .props as any;
    return restProps;
  }
  doSomething(): any {}

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as PublicWidgetWithProps);
  }
}

PublicWidgetWithProps.defaultProps = WidgetWithPropsInput;
