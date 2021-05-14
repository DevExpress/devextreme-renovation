import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(model: Widget): any {
  const sizes = model.props.sizes ?? { width: 0, height: 0 };
  return (
    <span>
      {sizes.height}

      {sizes.width}
    </span>
  );
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  height: number;
  export: object;
  sizes?: { height: number; width: number };
  stringValue: string;
  onClick: (a: number) => void;
  onSomething: EventCallBack<number>;
  defaultStringValue: string;
  stringValueChange?: (stringValue: string) => void;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
  onSomething: () => {},
  defaultStringValue: "",
  stringValueChange: () => {},
} as any as WidgetInputType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { stringValue: string };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      stringValue:
        this.props.stringValue !== undefined
          ? this.props.stringValue
          : this.props.defaultStringValue,
    };
    this.getHeight = this.getHeight.bind(this);
    this.getRestProps = this.getRestProps.bind(this);
  }

  stringValue!: string;

  getHeight(): number {
    this.props.onClick(10);
    const { onClick } = this.props as any;
    onClick(11);
    return this.props.height;
  }
  getRestProps(): { export: object; onSomething: EventCallBack<number> } {
    const { height, onClick, ...rest } = {
      ...this.props,
      stringValue:
        this.props.stringValue !== undefined
          ? this.props.stringValue
          : this.state.stringValue,
    } as any;
    return rest;
  }
  get restAttributes(): RestProps {
    const {
      defaultStringValue,
      export: exportProp,
      height,
      onClick,
      onSomething,
      sizes,
      stringValue,
      stringValueChange,
      ...restProps
    } = {
      ...this.props,
      stringValue:
        this.props.stringValue !== undefined
          ? this.props.stringValue
          : this.state.stringValue,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        stringValue:
          this.props.stringValue !== undefined
            ? this.props.stringValue
            : this.state.stringValue,
      },
      getHeight: this.getHeight,
      getRestProps: this.getRestProps,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
