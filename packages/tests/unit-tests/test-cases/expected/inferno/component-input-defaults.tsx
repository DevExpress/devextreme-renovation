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
  baseNested: any;
};
export const BaseProps: BasePropsType = Object.defineProperties(
  { height: 10 },
  {
    width: {
      enumerable: true,
      get: function () {
        return isMaterial() ? 20 : 10;
      },
    },
    baseNested: {
      enumerable: true,
      get: function () {
        return { text0: "3" };
      },
    },
  }
);
export declare type TextsPropsType = {
  text?: string;
};
export const TextsProps: TextsPropsType = Object.defineProperties(
  {},
  {
    text: {
      enumerable: true,
      get: function () {
        return format("text");
      },
    },
  }
);
export declare type ExpressionPropsType = {
  expressionDefault?: any;
};
export const ExpressionProps: ExpressionPropsType = Object.defineProperties(
  {},
  {
    expressionDefault: {
      enumerable: true,
      get: function () {
        return isMaterial() ? 20 : 10;
      },
    },
  }
);
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
    Object.getOwnPropertyDescriptors(
      Object.defineProperties(
        { template: () => <div></div> },
        {
          text: {
            enumerable: true,
            get: function () {
              return format("text");
            },
          },
          texts1: {
            enumerable: true,
            get: function () {
              return { text: format("text") };
            },
          },
          texts2: {
            enumerable: true,
            get: function () {
              return { text: format("text") };
            },
          },
          texts3: {
            enumerable: true,
            get: function () {
              return TextsProps;
            },
          },
        }
      )
    )
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
  baseNested: any;
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
  get baseNested() {
    return WidgetProps.baseNested;
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
      baseNested,
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
