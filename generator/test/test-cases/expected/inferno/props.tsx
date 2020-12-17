function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  height: number;
  export: object;
  onClick: (a: number) => void;
  onSomething: EventCallBack<number>;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
  onSomething: () => {},
};
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
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
