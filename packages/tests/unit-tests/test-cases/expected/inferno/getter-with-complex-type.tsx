import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(viewModel: Widget) {
  return <div></div>;
}

export declare type PropsType = {
  p: number;
};
export const Props: PropsType = {
  p: 10,
};
import { createElement as h } from "inferno-compat";
import { createReRenderEffect } from "@devextreme/vdom";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state: { i: number };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      i: 10,
    };
  }

  i!: number;

  createEffects() {
    return [createReRenderEffect()];
  }

  get g1(): number[] {
    if (this.__getterCache["g1"] !== undefined) {
      return this.__getterCache["g1"];
    }
    return (this.__getterCache["g1"] = ((): number[] => {
      return [this.props.p, this.state.i];
    })());
  }
  get g2(): number {
    return this.props.p;
  }
  get g3(): number {
    return this.state.i;
  }
  get restAttributes(): RestProps {
    const { p, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    g1?: number[];
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    const changesFunc = (
      oldObj: { [name: string]: any },
      nextObj: { [name: string]: any }
    ) =>
      Object.keys(nextObj).reduce((changes, nextObjKey) => {
        if (oldObj[nextObjKey] !== nextObj[nextObjKey])
          changes.push(nextObjKey);
        return changes;
      }, [] as string[]);
    const [propsChanges, stateChanges, contextChanges] = [
      changesFunc(this.props, nextProps),
      changesFunc(this.state, nextState),
      changesFunc(this.context, context),
    ];
    if (propsChanges.includes("p") || stateChanges.includes("i")) {
      this.__getterCache["g1"] = undefined;
    }
    super.componentWillUpdate();
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      i: this.state.i,
      g1: this.g1,
      g2: this.g2,
      g3: this.g3,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...Props,
};
