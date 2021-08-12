import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
import Base, { WidgetProps } from "./component-input";
function view(model: Child) {
  return <Base height={model.getProps().height} />;
}

export declare type ChildInputType = typeof WidgetProps & {
  height: number;
  onClick: (a: number) => void;
};
const ChildInput: ChildInputType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      height: 10,
      onClick: () => {},
    })
  )
);
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
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { children, height, onClick, width, ...restProps } = this
        .props as any;
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
    return view({
      props: { ...props },
      getProps: this.getProps,
      restAttributes: this.restAttributes,
    } as Child);
  }
}

Child.defaultProps = ChildInput;
