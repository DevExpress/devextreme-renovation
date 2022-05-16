import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view() {}

interface WidgetInputType {
  size?: { width: number; height: number };
  type?: string;
}

const WidgetInput = {} as Partial<WidgetInputType>;
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
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  getHeight: number;
  type: string;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(
    Object.create(
      Object.prototype,
      Object.assign(
        Object.getOwnPropertyDescriptors(WidgetInput),
        Object.getOwnPropertyDescriptors(
          convertRulesToOptions<typeof WidgetInput>(__defaultOptionRules)
        )
      )
    ),
    inProps
  );

  const __getHeight = useCallback(
    function __getHeight(): number {
      return props.size.height;
    },
    [props.size]
  );
  const __type = useCallback(
    function __type(): string {
      const { type } = props;
      return type;
    },
    [props.type]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { size, type, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view();
}

type WidgetOptionRule = DefaultOptionsRule<typeof WidgetInput>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}
