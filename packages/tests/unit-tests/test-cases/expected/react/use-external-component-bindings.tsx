import Props from "./component-bindings-only";
function view(model: Widget) {
  return <div>{model.props.height}</div>;
}

import {
  convertRulesToOptions,
  Rule,
} from "../../../../jquery-helpers/default_options";
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface Widget {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof Props & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, height, info, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
};

export default Widget;

function __createDefaultProps() {
  return {
    ...Props,
  };
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof Props>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = {
    ...__createDefaultProps(),
    ...convertRulesToOptions<typeof Props>(__defaultOptionRules),
  };
}
