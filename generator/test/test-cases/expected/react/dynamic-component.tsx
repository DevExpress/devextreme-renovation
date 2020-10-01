import DynamicComponent from "./props";
function view({
  Component,
  props: { height },
}: DynamicComponentCreator): JSX.Element {
  return <Component height={height} />;
}

export declare type WidgetInputType = {
  height: number;
};
const WidgetInput: WidgetInputType = {
  height: 10,
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface DynamicComponentCreator {
  props: typeof WidgetInput & RestProps;
  Component: any;
  restAttributes: RestProps;
}

export default function DynamicComponentCreator(
  props: typeof WidgetInput & RestProps
) {
  const __Component = useCallback(function __Component(): any {
    return DynamicComponent;
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    Component: __Component(),
    restAttributes: __restAttributes(),
  });
}

DynamicComponentCreator.defaultProps = {
  ...WidgetInput,
};
