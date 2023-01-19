import {
  BaseInfernoComponent,
  createContext,
} from '@devextreme/runtime/inferno';
function view(model: Widget): any {
  return <span></span>;
}
const P1Context = createContext(5);
const ContextForConsumer = createContext(null);
const GetterContext = createContext('default');

export type PropsType = {
  p1: number;
};
const Props: PropsType = {
  p1: 10,
};
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;
  get contextConsumer(): number {
    if (this.context[P1Context.id]) {
      return this.context[P1Context.id];
    }
    return P1Context.defaultValue as any;
  }
  provider: number = 10;
  get consumer(): any {
    if (this.context[ContextForConsumer.id]) {
      return this.context[ContextForConsumer.id];
    }
    return ContextForConsumer.defaultValue as any;
  }

  constructor(props: any) {
    super(props);
  }

  getChildContext() {
    return {
      ...this.context,
      [P1Context.id]: this.provider || P1Context.defaultValue,
      [GetterContext.id]: this.contextProvider || GetterContext.defaultValue,
    };
  }

  get sum(): any {
    return this.provider + this.contextConsumer;
  }
  get contextProvider(): any {
    if (this.__getterCache['contextProvider'] !== undefined) {
      return this.__getterCache['contextProvider'];
    }
    return (this.__getterCache['contextProvider'] = ((): any => {
      return 'provide';
    })());
  }
  get restAttributes(): RestProps {
    const { p1, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    contextProvider?: any;
  } = {};

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      contextConsumer: this.contextConsumer,
      provider: this.provider,
      consumer: this.consumer,
      sum: this.sum,
      contextProvider: this.contextProvider,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = Props;
