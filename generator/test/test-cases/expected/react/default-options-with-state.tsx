function view() {}
export declare type WidgetPropsType = {
  p1: string;
  p2: string;
  defaultP1?: string;
  p1Change?: (p1: string) => void;
  defaultP2?: string;
  p2Change?: (p2: string) => void;
};
export const WidgetProps: WidgetPropsType = {
  p1: "",
  p2: "",
  defaultP1: "",
  p1Change: () => {},
  defaultP2: "",
  p2Change: () => {},
};

import {
  convertRulesToOptions,
  Rule,
} from "../../../../component_declaration/default_options";
import React, { useState, useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const [__state_p1, __state_setP1] = useState(() =>
    props.p1 !== undefined ? props.p1 : props.defaultP1!
  );
  const [__state_p2, __state_setP2] = useState(() =>
    props.p2 !== undefined ? props.p2 : props.defaultP2!
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultP1,
        defaultP2,
        p1,
        p1Change,
        p2,
        p2Change,
        ...restProps
      } = {
        ...props,
        p1: props.p1 !== undefined ? props.p1 : __state_p1,
        p2: props.p2 !== undefined ? props.p2 : __state_p2,
      };
      return restProps;
    },
    [props, __state_p1, __state_p2]
  );

  return view();
}

function __processTwoWayProps(defaultProps: typeof WidgetProps & RestProps) {
  const twoWayProps: string[] = ["p1", "p2"];

  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = (defaultProps as any)[propName];
    const defaultPropName = twoWayProps.some((p) => p === propName)
      ? "default" + propName.charAt(0).toUpperCase() + propName.slice(1)
      : propName;
    (props as any)[defaultPropName] = propValue;
    return props;
  }, {});
}

function __createDefaultProps() {
  return {
    ...WidgetProps,
  };
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = {
    ...__createDefaultProps(),
    ...__processTwoWayProps(convertRulesToOptions(__defaultOptionRules)),
  };
}
