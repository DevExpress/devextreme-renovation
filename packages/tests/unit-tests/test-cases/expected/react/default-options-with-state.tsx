import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view() {}

interface WidgetPropsType {
  p1?: string;
  p2?: string;
  defaultP1?: string;
  p1Change?: (p1: string) => void;
  defaultP2?: string;
  p2Change?: (p2: string) => void;
}
export const WidgetProps = {
  defaultP1: '',
  p1Change: () => {},
  defaultP2: '',
  p2Change: () => {},
} as Partial<WidgetPropsType>;
import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';
import { useState, useCallback } from 'react';

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

export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetProps>>
  >(
    Object.create(
      Object.prototype,
      Object.assign(
        Object.getOwnPropertyDescriptors(WidgetProps),
        Object.getOwnPropertyDescriptors(
          __processTwoWayProps(
            convertRulesToOptions<typeof WidgetProps>(__defaultOptionRules)
          )
        )
      )
    ),
    inProps
  );

  const [__state_p1, __state_setP1] = useState<string>(() =>
    props.p1 !== undefined ? props.p1 : props.defaultP1!
  );
  const [__state_p2, __state_setP2] = useState<string>(() =>
    props.p2 !== undefined ? props.p2 : props.defaultP2!
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultP1, defaultP2, p1, p1Change, p2, p2Change, ...restProps } =
        {
          ...props,
          p1: props.p1 !== undefined ? props.p1 : __state_p1,
          p2: props.p2 !== undefined ? props.p2 : __state_p2,
        };
      return restProps as RestProps;
    },
    [props, __state_p1, __state_p2]
  );

  return view();
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
type WidgetOptionRule = DefaultOptionsRule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}
