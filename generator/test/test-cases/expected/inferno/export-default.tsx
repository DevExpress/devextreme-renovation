function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  prop?: boolean;
};
const WidgetInput: WidgetInputType = {};
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state = {};
  refs: any;
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
  }

  get restAttributes(): RestProps {
    const { prop, ...restProps } = this.props;
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
