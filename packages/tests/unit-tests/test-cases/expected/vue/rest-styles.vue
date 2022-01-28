<template>
  <div style="display: contents"
    ><span v-bind:style="__processStyle(__styles)"></span
    ><WidgetWithoutStyleProp :style="__styles"></WidgetWithoutStyleProp
    ><WidgetWithStyleProp :style="__styles"></WidgetWithStyleProp
  ></div>
</template>
<script>
import WidgetWithoutStyleProp from "./component-pass-one";
import WidgetWithStyleProp from "./widget-with-atyle-prop";
const modifyStyles = (styles) => {
  return { height: "100px", ...styles };
};
const WidgetInput = {};
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
const kebabCase = (str) => {
  return str.replace(uppercasePattern, "-$&").toLowerCase();
};

const isNumeric = (value) => {
  if (typeof value === "number") return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style, value) => {
  return NUMBER_STYLES.has(style) ? value : `${value}px`;
};

const normalizeStyles = (styles) => {
  if (!(styles instanceof Object)) return undefined;

  return Object.entries(styles).reduce((result, [key, value]) => {
    const kebabString = kebabCase(key);
    result[kebabString] = isNumeric(value)
      ? getNumberStyleValue(kebabString, value)
      : value;
    return result;
  }, {});
};

export const DxWidget = {
  name: "Widget",
  components: {
    WidgetWithoutStyleProp,
    WidgetWithStyleProp,
  },
  props: WidgetInput,
  computed: {
    __styles() {
      const { style } = this.__restAttributes;
      return modifyStyles(style);
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  methods: {
    __processStyle(value) {
      return normalizeStyles(value);
    },
  },
};
export default DxWidget;
</script>
