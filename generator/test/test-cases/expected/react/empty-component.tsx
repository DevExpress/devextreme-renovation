import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

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
  keyof {
    height?: number;
    width?: number;
  }
>;
interface Widget {
  height?: number;
  width?: number;
  restAttributes: RestProps;
}

export default function Widget(
  props: {
    height?: number;
    width?: number;
  } & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view1({ ...props, restAttributes: __restAttributes() });
}

function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
