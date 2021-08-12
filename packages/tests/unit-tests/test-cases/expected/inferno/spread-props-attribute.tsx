import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
import InnerWidget from "./dx-inner-widget";
function view({ props, restAttributes }: Widget) {
  return <InnerWidget {...(props as any)} {...restAttributes} />;
}

export declare type WidgetInputType = {
  visible?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
export const WidgetInput: WidgetInputType = {
  valueChange: () => {},
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { value?: boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { defaultValue, value, valueChange, visible, ...restProps } = {
        ...this.props,
        value:
          this.props.value !== undefined ? this.props.value : this.state.value,
      } as any;
      return restProps;
    })());
  }
  __getterCache: {
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props !== nextProps || false) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        value:
          this.props.value !== undefined ? this.props.value : this.state.value,
      },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
