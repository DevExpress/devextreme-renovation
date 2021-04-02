import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
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

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(): any {
    const v = this.props.height;
  }
  get restAttributes(): RestProps {
    const { children, height, width, ...restProps } = this.props as any;
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
