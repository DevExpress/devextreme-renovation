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
  onClick: (a: number) => void;
  onSomething: EventCallBack<number>;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
  onSomething: () => {},
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<
  typeof WidgetInput & RestProps
> {
  state = {};
  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);

    this.getHeight = this.getHeight.bind(this);
    this.getRestProps = this.getRestProps.bind(this);
  }

  getHeight(): number {
    this.props.onClick(10);
    const { onClick } = this.props;
    onClick(11);
    return this.props.height;
  }
  getRestProps(): { export: object; onSomething: EventCallBack<number> } {
    const { height, onClick, ...rest } = this.props;
    return rest;
  }
  get restAttributes(): RestProps {
    const {
      export: exportProp,
      height,
      onClick,
      onSomething,
      sizes,
      ...restProps
    } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      getHeight: this.getHeight,
      getRestProps: this.getRestProps,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
