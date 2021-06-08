function view() {
  return <div></div>;
}

export declare type NestedPropsType = {
  oneWay?: boolean;
  twoWay?: boolean;
  defaultTwoWay: boolean;
  twoWayChange?: (twoWay?: boolean) => void;
};
export const NestedProps: NestedPropsType = {
  oneWay: false,
  defaultTwoWay: false,
  twoWayChange: () => {},
};
export declare type WidgetPropsType = {
  nested?: typeof NestedProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {};
import {
  convertRulesToOptions,
  Rule,
} from "../../../../jquery-helpers/default_options";
import * as React from "react";
import { useCallback } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).map((child) => {
    const { children: childChildren, ...childProps } = child.props;
    const collectedChildren = {} as any;
    __collectChildren(childChildren).forEach(
      ({ __name, ...restProps }: any) => {
        if (__name) {
          if (!collectedChildren[__name]) {
            collectedChildren[__name] = [];
          }
          collectedChildren[__name].push(restProps);
        }
      }
    );
    return {
      ...collectedChildren,
      ...childProps,
      __name: child.type.propName,
    };
  });
}
export const Nested: React.FunctionComponent<typeof NestedProps> & {
  propName: string;
} = () => null;
Nested.propName = "nested";
Nested.defaultProps = NestedProps;

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
  nestedChildren: <T>() => T[];
  __getNestedNested: typeof NestedProps | undefined;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { __defaultNestedValues, children, nested, ...restProps } = {
        ...props,
        nested: __getNestedNested(),
      };
      return restProps;
    },
    [props]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren<T>(): T[] {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedNested = useCallback(
    function __getNestedNested(): typeof NestedProps | undefined {
      const nested = __nestedChildren<
        typeof NestedProps & { __name: string }
      >().filter((child) => child.__name === "nested");
      return props.nested
        ? props.nested
        : nested.length
        ? nested?.[0]
        : undefined;
    },
    [props.nested, props.children]
  );

  return view();
}

function __createDefaultProps() {
  return {
    ...WidgetProps,
    ...convertRulesToOptions<typeof WidgetProps>([
      { device: true, options: { nested: { oneWay: true } } },
    ]),
  };
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
  Widget.defaultProps = {
    ...__createDefaultProps(),
    ...convertRulesToOptions<typeof WidgetProps>(__defaultOptionRules),
  };
}
