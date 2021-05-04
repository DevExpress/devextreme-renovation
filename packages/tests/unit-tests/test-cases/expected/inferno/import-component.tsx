import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
import Base, { WidgetProps } from "./component-input";
function view(model: Child): any | null {
  return <Base height={model.getProps().height} />;
}

export declare type ChildInputType = typeof WidgetProps & {
  height: number;
  onClick: (a: number) => void;
};
const ChildInput: ChildInputType = {
  ...WidgetProps,
  height: 10,
  onClick: () => {},
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Child extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.getProps = this.getProps.bind(this);
  }

  getProps(): typeof WidgetProps {
    return { height: this.props.height } as typeof WidgetProps;
  }
  get restAttributes(): RestProps {
    const { children, height, onClick, width, ...restProps } = this
      .props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      getProps: this.getProps,
      restAttributes: this.restAttributes,
    } as Child);
  }
}

Child.defaultProps = {
  ...ChildInput,
};
