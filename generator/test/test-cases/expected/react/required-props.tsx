function view() {}
export declare type WidgetInputType = {
  size: { width: number; height: number };
  type: string;
};
const WidgetInput: WidgetInputType = ({} as any) as WidgetInputType;
import {
  convertRulesToOptions,
  Rule,
} from "../../../../component_declaration/default_options";
import React, { useCallback, HtmlHTMLAttributes } from "react";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof WidgetInput
>;
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

function __createDefaultProps() {
  return {
    ...WidgetInput,
  };
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof WidgetInput>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = {
    ...__createDefaultProps(),
    ...convertRulesToOptions<typeof WidgetInput>(__defaultOptionRules),
  };
}
