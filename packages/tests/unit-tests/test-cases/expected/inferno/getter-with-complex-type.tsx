import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
  createContext,
} from "@devextreme/vdom";
const SimpleContext = createContext<number>(5);
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
import { createReRenderEffect, changesFunc } from "@devextreme/vdom";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state: { i: number };

  refs: any;
  get cons(): number {
    if ("SimpleContext" in this.context) {
      return this.context.SimpleContext;
    }
    return SimpleContext;
  }

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

  getChildContext() {
    return {
      ...this.context,
      SimpleContext: this.provide,
    };
  }

  get provide(): any {
    if (this.__getterCache["provide"] !== undefined) {
      return this.__getterCache["provide"];
    }
    return (this.__getterCache["provide"] = (() => {
      return this.state.i;
    })());
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
  get g4(): number[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): number[] => {
      return [this.cons];
    })());
  }
  get restAttributes(): RestProps {
    const { p, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    provide?: any;
    g1?: number[];
    g4?: number[];
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    const [propsChanges, stateChanges, contextChanges] = [
      changesFunc(this.props, nextProps),
      changesFunc(this.state, nextState),
      changesFunc(this.context, context),
    ];
    if (stateChanges.includes("i")) {
      this.__getterCache["provide"] = undefined;
    }
    if (propsChanges.includes("p") || stateChanges.includes("i")) {
      this.__getterCache["g1"] = undefined;
    }
    if (contextChanges.includes("SimpleContext")) {
      this.__getterCache["g4"] = undefined;
    }
    super.componentWillUpdate();
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      i: this.state.i,
      cons: this.cons,
      provide: this.provide,
      g1: this.g1,
      g2: this.g2,
      g3: this.g3,
      g4: this.g4,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...Props,
};
