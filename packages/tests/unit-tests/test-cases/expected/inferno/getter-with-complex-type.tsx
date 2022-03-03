import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
  createContext,
} from "@devextreme/runtime/inferno";
const SimpleContext = createContext<number>(5);
function view(viewModel: Widget) {
  return <div></div>;
}
type UserType = "user" | "not";

export declare type SomeNestedType = {
  text: string;
};
export const SomeNested: SomeNestedType = {
  text: "",
};
export declare type PropsType = {
  p: number;
  someNestedProp: typeof SomeNested;
};
export const Props: PropsType = {
  p: 10,
  someNestedProp: Object.freeze({ text: "" }) as any,
};
import { createElement as h } from "inferno-compat";
import { createReRenderEffect } from "@devextreme/runtime/inferno";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state: { i: number };

  refs: any;
  mutableVar: number = 10;
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
  get g5(): number[] {
    return [this.state.i, this.mutableVar];
  }
  get userGet(): UserType {
    return "user";
  }
  get nestedGet(): { text: string } {
    if (this.__getterCache["nestedGet"] !== undefined) {
      return this.__getterCache["nestedGet"];
    }
    return (this.__getterCache["nestedGet"] = ((): { text: string } => {
      return this.props.someNestedProp;
    })());
  }
  get restAttributes(): RestProps {
    const { p, someNestedProp, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    provide?: any;
    g1?: number[];
    g4?: number[];
    nestedGet?: { text: string };
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
    if (this.context["SimpleContext"] !== context["SimpleContext"]) {
      this.__getterCache["g4"] = undefined;
    }
    if (this.props["someNestedProp"] !== nextProps["someNestedProp"]) {
      this.__getterCache["nestedGet"] = undefined;
    }
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
      g5: this.g5,
      userGet: this.userGet,
      nestedGet: this.nestedGet,
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
