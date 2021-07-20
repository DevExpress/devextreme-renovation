import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view() {
  return <div></div>;
}

export declare type WidgetPropsType = {};
export const WidgetProps: WidgetPropsType = {};
import {
  convertRulesToOptions,
  Rule,
} from "../../../../jquery-helpers/default_options";
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

  constructor(props: any) {
    super(props);
  }

  get restAttributes(): RestProps {
    const { ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      ...convertRulesToOptions<typeof WidgetProps>([
        { device: true, options: {} },
      ]),
    })
  )
);

type WidgetOptionRule = Rule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Widget.defaultProps),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof WidgetProps>(__defaultOptionRules)
      )
    )
  );
}
