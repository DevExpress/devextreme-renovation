import { InfernoComponent } from "@devextreme-generator/inferno-common";
export const COMPONENT_INPUT_CLASS = "c3";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetPropsType = {
  height?: number;
  width?: number;
  children?: any;
};
export const WidgetProps: WidgetPropsType = {
  height: 10,
  width: 10,
};
import { createElement as h } from "inferno-compat";
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
    super(props);

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

Widget.defaultProps = {
  ...WidgetProps,
};
