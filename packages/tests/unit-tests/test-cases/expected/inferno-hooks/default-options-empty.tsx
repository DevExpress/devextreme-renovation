function view() {
  return <div></div>;
}

export type WidgetPropsType = {};
export const WidgetProps: WidgetPropsType = {};
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';
import { useCallback, HookContainer } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view();
}

HooksWidget.defaultProps = Object.create(
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
  HooksWidget.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(HooksWidget.defaultProps),
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
  return <HookContainer renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
