function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export declare type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  onSelect?: (e: any) => any;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = ({
  defaultValue: 14,
  valueChange: () => {},
} as any) as InnerWidgetPropsType;
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

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof InnerWidgetProps
>;
interface InnerWidget {
  props: typeof InnerWidgetProps & RestProps;
  restAttributes: RestProps;
}

const InnerWidget: React.FC<typeof InnerWidgetProps & RestProps> = (props) => {
  const [__state_value, __state_setValue] = useState<number>(() =>
    props.value !== undefined ? props.value : props.defaultValue!
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultValue,
        onSelect,
        selected,
        value,
        valueChange,
        ...restProps
      } = {
        ...props,
        value: props.value !== undefined ? props.value : __state_value,
      };
      return restProps;
    },
    [props, __state_value]
  );

  return view({
    props: {
      ...props,
      value: props.value !== undefined ? props.value : __state_value,
    },
    restAttributes: __restAttributes(),
  });
};

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};

export default InnerWidget;
