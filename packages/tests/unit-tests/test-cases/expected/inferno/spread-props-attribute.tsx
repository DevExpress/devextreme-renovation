import { Fragment } from 'inferno';
import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from '@devextreme/runtime/inferno';
import InnerWidget from './dx-inner-widget';
function view({ attributes, props, restAttributes }: Widget) {
  return (
    <Fragment>
      <InnerWidget {...(props as any)} {...restAttributes} />

      <div {...(attributes as any)} />
    </Fragment>
  );
}

export type WidgetInputType = {
  visible?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
export const WidgetInput: WidgetInputType = {
  valueChange: () => {},
};
import { createElement as h } from 'inferno-compat';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { counter: number; notUsedValue: number; value?: boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      counter: 1,
      notUsedValue: 1,
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  counter!: number;
  notUsedValue!: number;

  get attributes(): any {
    return { visible: this.props.visible, value: this.state.counter };
  }
  get restAttributes(): RestProps {
    const { defaultValue, value, valueChange, visible, ...restProps } = {
      ...this.props,
      value:
        this.props.value !== undefined ? this.props.value : this.state.value,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        value:
          this.props.value !== undefined ? this.props.value : this.state.value,
      },
      counter: this.state.counter,
      notUsedValue: this.state.notUsedValue,
      attributes: this.attributes,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
