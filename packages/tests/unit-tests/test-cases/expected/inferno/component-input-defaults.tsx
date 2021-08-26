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
  baseNested?: typeof TextsProps;
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
        return TextsProps;
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
export declare type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  someTemplate?: any;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors(
      Object.defineProperties(
        { someTemplate: () => <div></div> },
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
export declare type PickedPropsType = {
  someValue?: string;
};
export const PickedProps: PickedPropsType = Object.defineProperties(
  {},
  {
    someValue: {
      enumerable: true,
      get: function () {
        return format("text");
      },
    },
  }
);
export declare type WidgetTypePropsType = {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  someTemplate?: any;
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps;
  someValue?: string;
};
export const WidgetTypeProps: WidgetTypePropsType = {
  text: WidgetProps.text,
  texts1: WidgetProps.texts1,
  texts2: WidgetProps.texts2,
  texts3: WidgetProps.texts3,
  someTemplate: WidgetProps.someTemplate,
  height: WidgetProps.height,
  width: WidgetProps.width,
  baseNested: WidgetProps.baseNested,
  someValue: PickedProps.someValue,
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
      height,
      someTemplate,
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
      props: { ...props, someTemplate: getTemplate(props.someTemplate) },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetProps;
