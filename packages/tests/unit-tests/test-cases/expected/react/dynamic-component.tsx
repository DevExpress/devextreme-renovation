import DynamicComponent, { WidgetInput } from "./props";
import DynamicComponentWithTemplate, {
  WidgetInput as PropsWithTemplate,
} from "./template";
function view({
  Component,
  ComponentWithTemplate,
  JSXTemplateComponent,
  internalStateValue,
  onComponentClick,
  props: { height },
  spreadProps,
}: DynamicComponentCreator): any | null {
  return (
    <div>
      <JSXTemplateComponent
        height={internalStateValue}
        onClick={onComponentClick}
        {...spreadProps}
      />

      <Component height={height} onClick={onComponentClick} {...spreadProps} />

      <ComponentWithTemplate
        template={({ textProp }) => (
          <div style={normalizeStyles({ height: "50px" })}>{textProp}</div>
        )}
      />
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
const NUMBER_STYLES = new Set([
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "border-imageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "fillOpacity",
  "flex",
  "flexGrow",
  "flexNegative",
  "flexOrder",
  "flexPositive",
  "flexShrink",
  "floodOpacity",
  "fontWeight",
  "gridColumn",
  "gridRow",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
]);

const isNumeric = (value: string | number) => {
  if (typeof value === "number") return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style: string, value: string | number) => {
  return NUMBER_STYLES.has(style) ? value : `${value}px`;
};

const normalizeStyles = (styles: unknown) => {
  if (!(styles instanceof Object)) return undefined;

  return Object.entries(styles).reduce(
    (result: Record<string, string | number>, [key, value]) => {
      result[key] = isNumeric(value) ? getNumberStyleValue(key, value) : value;
      return result;
    },
    {} as Record<string, string | number>
  );
};

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface DynamicComponentCreator {
  props: typeof Props & RestProps;
  internalStateValue: number;
  Component: typeof DynamicComponent;
  JSXTemplateComponent: React.FunctionComponent<Partial<typeof WidgetInput>>;
  ComponentWithTemplate: React.FunctionComponent<
    Partial<typeof PropsWithTemplate>
  >;
  spreadProps: any;
  onComponentClick: () => any;
  restAttributes: RestProps;
}

const DynamicComponentCreator: React.FC<typeof Props & RestProps> = (props) => {
  const [
    __state_internalStateValue,
    __state_setInternalStateValue,
  ] = useState<number>(0);

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
  const __ComponentWithTemplate = useCallback(
    function __ComponentWithTemplate(): React.FunctionComponent<
      Partial<typeof PropsWithTemplate>
    > {
      return DynamicComponentWithTemplate as React.FunctionComponent<
        Partial<typeof PropsWithTemplate>
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
    ComponentWithTemplate: __ComponentWithTemplate(),
    spreadProps: __spreadProps(),
    onComponentClick: __onComponentClick,
    restAttributes: __restAttributes(),
  });
};

export default DynamicComponentCreator;

DynamicComponentCreator.defaultProps = {
  ...Props,
};
