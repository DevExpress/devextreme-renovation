import {
  BaseInfernoComponent,
  InfernoComponent,
} from "@devextreme/vdom";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  prop?: boolean;
};
const WidgetInput: WidgetInputType = {};
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

Widget.defaultProps = {
  ...WidgetInput,
};
