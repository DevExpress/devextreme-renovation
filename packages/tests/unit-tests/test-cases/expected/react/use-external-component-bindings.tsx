import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import Props from './component-bindings-only';
function view(model: Widget) {
  return <div>{model.props.height}</div>;
}

import {
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../jquery-helpers/default_options';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof Props>> & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<Required<GetPropsType<typeof Props>>>(
    Object.create(
      Object.prototype,
      Object.assign(
        Object.getOwnPropertyDescriptors(Props),
        Object.getOwnPropertyDescriptors(
          convertRulesToOptions<typeof Props>(__defaultOptionRules)
        )
      )
    ),
    inProps
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, height, info, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

type WidgetOptionRule = DefaultOptionsRule<typeof Props>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}
