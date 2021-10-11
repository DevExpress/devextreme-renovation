<template>
  <div v-bind:style="__processStyle({ width: 100, height: 100 })"></div>
</template>
<script>
export const InnerWidgetProps = {
  selected: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
  value: {
    type: Number,
    default() {
      return 14;
    },
  },
};
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

export const DxInnerWidget = {
  name: "InnerWidget",
  props: InnerWidgetProps,
  model: {
    prop: "value",
    event: "update:value",
  },
  data() {
    return {
      value_state: this.value,
    };
  },
  computed: {
    __someGetter() {
      return this.props;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        ...(this.selected !== undefined && { selected: this.selected }),
        value: this.value_state,
        valueChange: this.valueChange,
      };
    },
  },
  watch: {
    value: ["__value_watcher"],
  },
  methods: {
    __processStyle(value) {
      return normalizeStyles(value);
    },
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    __value_watcher(s) {
      this.value_state = s;
    },
  },
};
export default DxInnerWidget;
</script>
