import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(model: Widget) {
  return <div></div>;
}
function isMaterial() {
  return true;
}
function format(key: string) {
  return "localized_" + key;
}

export declare type BasePropsType = {
  empty?: string;
  height?: number;
  width?: number;
};
export const BaseProps: BasePropsType = {
  height: 10,
  get width() {
    return isMaterial() ? 20 : 10;
  },
};
export declare type TextsPropsType = {
  text?: string;
};
export const TextsProps: TextsPropsType = {
  get text() {
    return format("text");
  },
};
export declare type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors({
      get text() {
        return format("text");
      },
      get texts1() {
        return { text: format("text") };
      },
      get texts2() {
        return TextsProps;
      },
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

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  get restAttributes(): RestProps {
    const { empty, height, text, texts1, texts2, width, ...restProps } = this
      .props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetProps;
