import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
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
export declare type ExpressionPropsType = {
  expressionDefault?: any;
};
export const ExpressionProps: ExpressionPropsType = {
  get expressionDefault() {
    return isMaterial() ? 20 : 10;
  },
};
export declare type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: any;
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
        return { text: format("text") };
      },
      get texts3() {
        return TextsProps;
      },
      template: () => <div></div>,
    })
  )
);
export declare type WidgetPropsTypeType = {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: any;
  empty?: string;
  height?: number;
  width?: number;
  expressionDefault?: any;
};
const WidgetPropsType: WidgetPropsTypeType = {
  get text() {
    return WidgetProps.text;
  },
  get texts1() {
    return WidgetProps.texts1;
  },
  get texts2() {
    return WidgetProps.texts2;
  },
  get texts3() {
    return WidgetProps.texts3;
  },
  get template() {
    return WidgetProps.template;
  },
  get height() {
    return WidgetProps.height;
  },
  get width() {
    return WidgetProps.width;
  },
  get expressionDefault() {
    return ExpressionProps.expressionDefault;
  },
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
const getTemplate = (TemplateProp: any) =>
  TemplateProp &&
  (TemplateProp.defaultProps
    ? (props: any) => <TemplateProp {...props} />
    : TemplateProp);
export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  get restAttributes(): RestProps {
    const {
      empty,
      expressionDefault,
      height,
      template,
      text,
      texts1,
      texts2,
      texts3,
      width,
      ...restProps
    } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, template: getTemplate(props.template) },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetPropsType;
