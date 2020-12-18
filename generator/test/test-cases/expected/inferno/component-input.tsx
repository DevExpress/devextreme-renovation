export const COMPONENT_INPUT_CLASS = "c3";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetPropsType = {
  height?: number;
  width?: number;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  height: 10,
  width: 10,
};
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetProps & RestProps
> {
  state = {};
  refs: any;

  constructor(props: typeof WidgetProps & RestProps) {
    super({
      ...WidgetProps,
      ...props,
    });

    this.onClick = this.onClick.bind(this);
  }

  onClick(): any {
    const v = this.props.height;
  }
  get restAttributes(): RestProps {
    const { children, height, width, ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      onClick: this.onClick,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
