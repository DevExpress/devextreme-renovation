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
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
]);

const uppercasePattern = /[A-Z]/g;
const kebabCase = (str: string) => {
  return str.replace(uppercasePattern, "-$&").toLowerCase();
};

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
      const kebabString = kebabCase(key);
      result[kebabString] = isNumeric(value)
        ? getNumberStyleValue(kebabString, value)
        : value;
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

export default function InnerWidget(
  props: typeof InnerWidgetProps & RestProps
) {
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
}

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};
