import {
  RefObject,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(viewModel: Widget) {
  return <div ref={viewModel.divRef}></div>;
}

export declare type WidgetInputType = {
  prop1?: number;
  prop2?: number;
};
const WidgetInput: WidgetInputType = {};
import { createElement as h } from "inferno-compat";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;
  divRef: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.getHeight = this.getHeight.bind(this);
    this.getSize = this.getSize.bind(this);
  }

  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { prop1, prop2, ...restProps } = this.props as any;
      return restProps;
    })());
  }
  getHeight(p: number = 10, p1: any): string {
    return `${this.props.prop1} + ${this.props.prop2} + ${this.divRef.current?.innerHTML} + ${p}`;
  }
  getSize(): string {
    return `${this.props.prop1} + ${
      this.divRef.current?.innerHTML
    } + ${this.getHeight(0, 0)}`;
  }
  __getterCache: {
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props !== nextProps) {
      this.__getterCache["restAttributes"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: { ...props },
      divRef: this.divRef,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
