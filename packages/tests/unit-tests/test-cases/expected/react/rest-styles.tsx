const modifyStyles = (styles: any) => {
  return { height: "100px", ...styles };
};
function view({ styles }: Widget) {
  return <span style={normalizeStyles(styles)}></span>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";
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
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  styles: any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const __styles = useCallback(function __styles(): any {
    const { style } = __restAttributes();
    return modifyStyles(style);
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    styles: __styles(),
    restAttributes: __restAttributes(),
  });
};
Widget.defaultProps = {
  ...WidgetInput,
};

export default Widget;
