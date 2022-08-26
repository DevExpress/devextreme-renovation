import {
  RefObject,
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
function view(viewModel: Widget) {
  return <div ref={viewModel.divRef}></div>;
}

export type WidgetInputType = {
  prop1?: number;
  prop2?: number;
};
const WidgetInput: WidgetInputType = {};
import { createRef as infernoCreateRef } from 'inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
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
    const { prop1, prop2, ...restProps } = this.props as any;
    return restProps;
  }
  getHeight(p: number = 10, p1: any): string {
    return `${this.props.prop1} + ${this.props.prop2} + ${this.divRef.current?.innerHTML} + ${p}`;
  }
  getSize(): string {
    return `${this.props.prop1} + ${
      this.divRef.current?.innerHTML
    } + ${this.getHeight(0, 0)}`;
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
