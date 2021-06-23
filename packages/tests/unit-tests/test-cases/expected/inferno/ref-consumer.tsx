import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
  createContext,
} from "@devextreme/vdom";
export const SimpleContext = createContext<number>(10);
function view(model: GetterProvider) {
  return <div id="context-getter-provider"></div>;
}

export declare type PropsType = {
  p: number;
};
const Props: PropsType = {
  p: 0,
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class GetterProvider extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
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
      return this.props.p;
    })());
  }
  get restAttributes(): RestProps {
    const { p, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    provide?: any;
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
    if (propsChanges.includes("p")) {
      this.__getterCache["provide"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      provide: this.provide,
      restAttributes: this.restAttributes,
    } as GetterProvider);
  }
}

GetterProvider.defaultProps = {
  ...Props,
};
