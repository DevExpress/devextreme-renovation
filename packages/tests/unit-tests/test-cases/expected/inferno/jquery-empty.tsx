import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";

export declare type PropsType = {
  height?: number;
  width?: number;
};
const Props: PropsType = {};
import { createElement as h } from "inferno-compat";
import { createReRenderEffect } from "@devextreme/vdom";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { height, width, ...restProps } = this.props as any;
      return restProps;
    })());
  }
  __getterCache: {
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view1({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = Props;
function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.props.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
