import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/common';
function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = {
  defaultValue: 14,
  valueChange: () => {},
} as any as InnerWidgetPropsType;
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class InnerWidget extends BaseInfernoComponent<any> {
  state: { value: number };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get someGetter(): typeof InnerWidgetProps {
    return {
      ...this.props,
      value:
        this.props.value !== undefined ? this.props.value : this.state.value,
    };
  }
  get restAttributes(): RestProps {
    const { defaultValue, selected, value, valueChange, ...restProps } = {
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
      someGetter: this.someGetter,
      restAttributes: this.restAttributes,
    } as InnerWidget);
  }
}

InnerWidget.defaultProps = InnerWidgetProps;
