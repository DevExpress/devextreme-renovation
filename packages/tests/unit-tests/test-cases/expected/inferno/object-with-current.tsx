import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  someProp?: { current: string };
};
export const WidgetInput: WidgetInputType = {};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { someState?: { current: string }; existsState: { current: string } };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      someState: undefined,
      existsState: { current: "value" },
    };
    this.concatStrings = this.concatStrings.bind(this);
  }

  someState?: { current: string };
  existsState!: { current: string };

  concatStrings(): any {
    const fromProps = this.props.someProp?.current || "";
    const fromState = this.state.someState?.current || "";
    return `${fromProps}${fromState}${this.state.existsState.current}`;
  }
  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { someProp, ...restProps } = this.props as any;
      return restProps;
    })());
  }
  __getterCache: {
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      someState: this.state.someState,
      existsState: this.state.existsState,
      concatStrings: this.concatStrings,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
