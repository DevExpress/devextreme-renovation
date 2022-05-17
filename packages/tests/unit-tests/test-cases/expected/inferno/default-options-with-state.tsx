import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
function view() {
  return '';
}

export type WidgetPropsType = {
  p1: string;
  p2: string;
  defaultP1: string;
  p1Change?: (p1: string) => void;
  defaultP2: string;
  p2Change?: (p2: string) => void;
};
export const WidgetProps: WidgetPropsType = {
  defaultP1: '',
  p1Change: () => {},
  defaultP2: '',
  p2Change: () => {},
} as any as WidgetPropsType;
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { p1: string; p2: string };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      p1: this.props.p1 !== undefined ? this.props.p1 : this.props.defaultP1,
      p2: this.props.p2 !== undefined ? this.props.p2 : this.props.defaultP2,
    };
  }

  get restAttributes(): RestProps {
    const { defaultP1, defaultP2, p1, p1Change, p2, p2Change, ...restProps } = {
      ...this.props,
      p1: this.props.p1 !== undefined ? this.props.p1 : this.state.p1,
      p2: this.props.p2 !== undefined ? this.props.p2 : this.state.p2,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view();
  }
}

function __processTwoWayProps(defaultProps: typeof WidgetProps & RestProps) {
  const twoWayProps: string[] = ['p1', 'p2'];

  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = (defaultProps as any)[propName];
    const defaultPropName = twoWayProps.some((p) => p === propName)
      ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1)
      : propName;
    (props as any)[defaultPropName] = propValue;
    return props;
  }, {});
}
Widget.defaultProps = WidgetProps;

type WidgetOptionRule = DefaultOptionsRule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Widget.defaultProps),
      Object.getOwnPropertyDescriptors(
        __processTwoWayProps(
          convertRulesToOptions<typeof WidgetProps>(__defaultOptionRules)
        )
      )
    )
  );
}
