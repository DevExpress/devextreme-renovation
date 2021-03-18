import {
  BaseInfernoComponent,
  InfernoComponent,
} from "../../../../modules/inferno/base_component";
import { normalizeStyles } from "../../../../modules/inferno/utils";
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

Widget.defaultProps = {
  ...WidgetInput,
};
function view(viewModel: Widget) {
  const MyComponent = viewModel.props.loading
    ? loadingJSX(viewModel.loadingProps)
    : infoJSX(viewModel.props.greetings, viewModel.name);
  return <div>{MyComponent}</div>;
}
