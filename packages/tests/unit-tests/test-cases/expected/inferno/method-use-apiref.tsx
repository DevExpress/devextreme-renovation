import {
  RefObject,
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
import BaseWidget from './method';
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

export type WidgetWithApiRefInputType = {
  prop1?: number;
};
const WidgetWithApiRefInput: WidgetWithApiRefInputType = {};
import { createRef as infernoCreateRef } from 'inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

export default class WidgetWithApiRef extends BaseInfernoComponent<any> {
  state = {};
  refs: any;
  baseRef: RefObject<any> = infernoCreateRef<BaseWidget>();

  constructor(props: any) {
    super(props);

    this.getSomething = this.getSomething.bind(this);
  }

  get restAttributes(): RestProps {
    const { prop1, ...restProps } = this.props as any;
    return restProps;
  }
  getSomething(): string {
    return `${this.props.prop1} + ${this.baseRef?.current?.getHeight(
      1,
      undefined
    )}`;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      baseRef: this.baseRef,
      restAttributes: this.restAttributes,
    } as WidgetWithApiRef);
  }
}

WidgetWithApiRef.defaultProps = WidgetWithApiRefInput;
