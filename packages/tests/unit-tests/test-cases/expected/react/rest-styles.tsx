import WidgetWithoutStyleProp from "./component-pass-one";
import WidgetWithStyleProp from "./widget-with-atyle-prop";
const modifyStyles = (styles: any) => {
  return { height: "100px", ...styles };
};
function view({ styles }: Widget) {
  return (
    <React.Fragment>
      <span style={normalizeStyles(styles)}></span>

      <WidgetWithoutStyleProp
        style={normalizeStyles(styles)}
      ></WidgetWithoutStyleProp>

      <WidgetWithStyleProp
        style={normalizeStyles(styles)}
      ></WidgetWithStyleProp>
    </React.Fragment>
  );
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback } from "react";
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

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  styles: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __styles = useCallback(
    function __styles(): any {
      const { style } = __restAttributes();
      return modifyStyles(style);
    },
    [__restAttributes]
  );

  return view({
    props: { ...props },
    styles: __styles(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
