import Base, { WidgetProps } from "./component-input";
function view(model: Child) {
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
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Child extends InfernoComponent<
  typeof ChildInput & RestProps
> {
  state = {};
  refs: any;

  constructor(props: typeof ChildInput & RestProps) {
    super({
      ...ChildInput,
      ...props,
    });

    this.getProps = this.getProps.bind(this);
  }

  getProps(): typeof WidgetProps {
    return { height: this.props.height } as typeof WidgetProps;
  }
  get restAttributes(): RestProps {
    const { children, height, onClick, width, ...restProps } = this.props;
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
