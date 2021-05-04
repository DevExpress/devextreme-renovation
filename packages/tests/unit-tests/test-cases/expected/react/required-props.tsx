function view(): any | null {
  return null;
}

export declare type WidgetInputType = {
  size: { width: number; height: number };
  type: string;
};
const WidgetInput: WidgetInputType = ({} as any) as WidgetInputType;
import {
  convertRulesToOptions,
  Rule,
} from "../../../../jquery-helpers/default_options";
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: number;
  type: string;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
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
};

export default Widget;

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
