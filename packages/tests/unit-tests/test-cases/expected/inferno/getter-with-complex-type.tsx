import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
  createContext,
} from "@devextreme/vdom";

interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}
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
import { createReRenderEffect } from "@devextreme/vdom";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state: { internalField: number; i: number };

  refs: any;
  mutableField: number = 3;
  get cons(): number {
    if ("SimpleContext" in this.context) {
      return this.context.SimpleContext;
    }
    return SimpleContext;
  }
  slidingWindowStateHolder!: SlidingWindowState;

  constructor(props: any) {
    super(props);
    this.state = {
      internalField: 3,
      i: 10,
    };
    this.someFunc = this.someFunc.bind(this);
  }

  internalField!: number;
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
    return (this.__getterCache["provide"] = ((): any => {
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
    if (this.__getterCache["g2"] !== undefined) {
      return this.__getterCache["g2"];
    }
    return (this.__getterCache["g2"] = ((): number => {
      return this.props.p;
    })());
  }
  get g3(): number {
    if (this.__getterCache["g3"] !== undefined) {
      return this.__getterCache["g3"];
    }
    return (this.__getterCache["g3"] = ((): number => {
      return this.state.i;
    })());
  }
  get g4(): number[] {
    if (this.__getterCache["g4"] !== undefined) {
      return this.__getterCache["g4"];
    }
    return (this.__getterCache["g4"] = ((): number[] => {
      return [this.cons];
    })());
  }
  someFunc(): any {
    return this.props.p;
  }
  get g5(): number[] {
    return [
      this.someFunc(),
      this.g3,
      this.state.internalField,
      this.mutableField,
    ];
  }
  private get slidingWindowState(): SlidingWindowState {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return { indexesForReuse: [], slidingWindowIndexes: [] };
    }
    return slidingWindowState;
  }
  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { p, ...restProps } = this.props as any;
      return restProps;
    })());
  }
  __getterCache: {
    provide?: any;
    g1?: number[];
    g2?: number;
    g3?: number;
    g4?: number[];
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.state["i"] !== nextState["i"]) {
      this.__getterCache["provide"] = undefined;
    }
    if (
      this.props["p"] !== nextProps["p"] ||
      this.state["i"] !== nextState["i"]
    ) {
      this.__getterCache["g1"] = undefined;
    }
    if (this.props["p"] !== nextProps["p"]) {
      this.__getterCache["g2"] = undefined;
    }
    if (this.state["i"] !== nextState["i"]) {
      this.__getterCache["g3"] = undefined;
    }
    if (this.context["SimpleContext"] !== context["SimpleContext"]) {
      this.__getterCache["g4"] = undefined;
    }
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      internalField: this.state.internalField,
      i: this.state.i,
      cons: this.cons,
      provide: this.provide,
      g1: this.g1,
      g2: this.g2,
      g3: this.g3,
      g4: this.g4,
      someFunc: this.someFunc,
      g5: this.g5,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = Props;

class SomeClass {
  i: number = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
