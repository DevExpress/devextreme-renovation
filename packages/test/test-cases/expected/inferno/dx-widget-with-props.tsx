import { InfernoComponent } from "@devextreme-generator/inferno-common";

export declare type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
  number?: number;
  onClick?: (e: any) => void;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: "default text",
  number: 42,
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class WidgetWithProps extends InfernoComponent<
  typeof WidgetWithPropsInput & RestProps
> {
  state = {};
  refs: any;

  constructor(props: typeof WidgetWithPropsInput & RestProps) {
    super(props);

    this.doSomething = this.doSomething.bind(this);
  }

  get restAttributes(): RestProps {
    const { number, onClick, optionalValue, value, ...restProps } = this.props;
    return restProps;
  }
  doSomething(): any {}

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as WidgetWithProps);
  }
}

WidgetWithProps.defaultProps = {
  ...WidgetWithPropsInput,
};
function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}
