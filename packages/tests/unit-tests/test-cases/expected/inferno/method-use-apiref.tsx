import {
  RefObject,
  BaseInfernoComponent,
  InfernoComponent,
} from "@devextreme/vdom";
import BaseWidget from "./method";
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

export declare type WidgetWithApiRefInputType = {
  prop1?: number;
};
const WidgetWithApiRefInput: WidgetWithApiRefInputType = {};
import { createElement as h } from "inferno-compat";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class WidgetWithApiRef extends BaseInfernoComponent<
  typeof WidgetWithApiRefInput & RestProps
> {
  state = {};
  refs: any;
  baseRef: RefObject<any> = infernoCreateRef<BaseWidget>();

  constructor(props: typeof WidgetWithApiRefInput & RestProps) {
    super(props);

    this.getSomething = this.getSomething.bind(this);
  }

  get restAttributes(): RestProps {
    const { prop1, ...restProps } = this.props;
    return restProps;
  }
  getSomething(): string {
    return `${this.props.prop1} + ${this.baseRef?.current?.getHeight(
      1,
      undefined
    )}`;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      baseRef: this.baseRef,
      restAttributes: this.restAttributes,
    } as WidgetWithApiRef);
  }
}

WidgetWithApiRef.defaultProps = {
  ...WidgetWithApiRefInput,
};
