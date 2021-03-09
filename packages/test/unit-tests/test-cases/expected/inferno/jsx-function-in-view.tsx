const loadingJSX = ({ text }: any) => {
  return <div>{text}</div>;
};
function infoJSX(text: string, name: string) {
  return <span>{`${text} ${name}`}</span>;
}

export declare type WidgetInputType = {
  loading: boolean;
  greetings: string;
};
export const WidgetInput: WidgetInputType = {
  loading: true,
  greetings: "Hello",
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
  state = {};
  refs: any;
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
  }

  get loadingProps(): any {
    return { text: "Loading..." };
  }
  get name(): any {
    return "User";
  }
  get restAttributes(): RestProps {
    const { greetings, loading, ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      loadingProps: this.loadingProps,
      name: this.name,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
function view(viewModel: Widget) {
  const MyComponent = viewModel.props.loading
    ? loadingJSX(viewModel.loadingProps)
    : infoJSX(viewModel.props.greetings, viewModel.name);
  return <div>{MyComponent}</div>;
}
