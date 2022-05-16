import { GetPropsType } from '@devextreme/runtime/react';
function view() {
  return <div></div>;
}

interface WidgetPropsType {}
export const WidgetProps = {} as Partial<WidgetPropsType>;
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';
import { useCallback, HookComponent } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: Required<GetPropsType<typeof WidgetProps>> & RestProps;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view();
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

type WidgetOptionRule = DefaultOptionsRule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Widget.defaultProps),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof WidgetProps>([
          { device: true, options: {} },
        ])
      ),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof WidgetProps>(__defaultOptionRules)
      )
    )
  );
}

function HooksWidget(props: typeof WidgetProps & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
