function view() {}

export declare type WidgetInputType = {
  size: { width: number; height: number };
  type: string;
};
const WidgetInput: WidgetInputType = {} as any as WidgetInputType;
import {
  convertRulesToOptions,
  DefaultsRule,
} from "../../../../jquery-helpers/default_options";
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: number;
  type: string;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
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
      return restProps;
    },
    [props]
  );

  return view();
}

Widget.defaultProps = WidgetInput;

type WidgetOptionRule = DefaultsRule<typeof WidgetInput>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Widget.defaultProps),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof WidgetInput>(__defaultOptionRules)
      )
    )
  );
}
