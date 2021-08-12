import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
  createContext,
} from "@devextreme/vdom";
function view(model: Widget): any {
  return <span></span>;
}
const P1Context = createContext(5);
const GetterContext = createContext("default");

export declare type PropsType = {
  p1: number;
};
const Props: PropsType = {
  p1: 10,
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;
  get contextConsumer(): number {
    if ("P1Context" in this.context) {
      return this.context.P1Context;
    }
    return P1Context;
  }
  provider: number = 10;

  constructor(props: any) {
    super(props);
  }

  getChildContext() {
    return {
      ...this.context,
      P1Context: this.provider,
      GetterContext: this.contextProvider,
    };
  }

  get sum(): any {
    if (this.__getterCache["sum"] !== undefined) {
      return this.__getterCache["sum"];
    }
    return (this.__getterCache["sum"] = ((): any => {
      return this.provider + this.contextConsumer;
    })());
  }
  get contextProvider(): any {
    if (this.__getterCache["contextProvider"] !== undefined) {
      return this.__getterCache["contextProvider"];
    }
    return (this.__getterCache["contextProvider"] = ((): any => {
      return "provide";
    })());
  }
  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { p1, ...restProps } = this.props as any;
      return restProps;
    })());
  }
  __getterCache: {
    sum?: any;
    contextProvider?: any;
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (false || this.context["P1Context"] !== context["P1Context"]) {
      this.__getterCache["sum"] = undefined;
    }
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      contextConsumer: this.contextConsumer,
      provider: this.provider,
      sum: this.sum,
      contextProvider: this.contextProvider,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = Props;
