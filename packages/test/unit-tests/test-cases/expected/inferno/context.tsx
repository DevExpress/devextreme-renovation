import {
  InfernoComponent,
  createContext,
} from "@devextreme-generator/inferno-common";
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

export default class Widget extends InfernoComponent<typeof Props & RestProps> {
  state = {};
  refs: any;
  get contextConsumer(): number {
    if ("P1Context" in this.context) {
      return this.context.P1Context;
    }
    return P1Context;
  }
  provider: number = 10;

  constructor(props: typeof Props & RestProps) {
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
    return this.provider + this.contextConsumer;
  }
  get contextProvider(): any {
    return "provide";
  }
  get restAttributes(): RestProps {
    const { p1, ...restProps } = this.props;
    return restProps;
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

Widget.defaultProps = {
  ...Props,
};
