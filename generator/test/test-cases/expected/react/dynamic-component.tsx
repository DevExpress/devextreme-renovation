import DynamicComponent, { WidgetInput } from "./props";
function view({
  Component,
  JSXTemplateComponent,
  internalStateValue,
  onComponentClick,
  props: { height },
  spreadProps,
}: DynamicComponentCreator): any {
  return (
    <div>
      <JSXTemplateComponent
        height={internalStateValue}
        onClick={onComponentClick}
        {...spreadProps}
      />

      <Component height={height} onClick={onComponentClick} />
    </div>
  );
}

export declare type PropsType = {
  height: number;
};
const Props: PropsType = {
  height: 10,
};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface DynamicComponentCreator {
  props: typeof Props & RestProps;
  internalStateValue: number;
  Component: typeof DynamicComponent;
  JSXTemplateComponent: React.FunctionComponent<Partial<typeof WidgetInput>>;
  spreadProps: any;
  onComponentClick: () => any;
  restAttributes: RestProps;
}

export default function DynamicComponentCreator(
  props: typeof Props & RestProps
) {
  const [__state_internalStateValue, __state_setInternalStateValue] = useState<
    number
  >(0);

  const __Component = useCallback(
    function __Component(): typeof DynamicComponent {
      return DynamicComponent;
    },
    []
  );
  const __JSXTemplateComponent = useCallback(
    function __JSXTemplateComponent(): React.FunctionComponent<
      Partial<typeof WidgetInput>
    > {
      return DynamicComponent as React.FunctionComponent<
        Partial<typeof WidgetInput>
      >;
    },
    []
  );
  const __spreadProps = useCallback(function __spreadProps(): any {
    return { export: {} };
  }, []);
  const __onComponentClick = useCallback(function __onComponentClick(): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    internalStateValue: __state_internalStateValue,
    Component: __Component(),
    JSXTemplateComponent: __JSXTemplateComponent(),
    spreadProps: __spreadProps(),
    onComponentClick: __onComponentClick,
    restAttributes: __restAttributes(),
  });
}

DynamicComponentCreator.defaultProps = {
  ...Props,
};
