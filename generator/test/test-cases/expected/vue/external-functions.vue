<template>
  <div
    v-bind:class="global_CLASS_NAME"
    v-bind:style="__processStyle(global_externalFunction())"
    ><template v-for="(cell, index) of cells"
      ><span :key="index"
        ><div v-if="global_conditionFn(cell) && index > 0"
          >{{ global_getValue(cell) }}{{ __addPostfix(index)
          }}{{ global_SomeClass.name }}</div
        ></span
      ></template
    ><div
      ><template v-for="i of global_array"
        ><div :key="i">{{ i.toString() }}</div></template
      ></div
    ></div
  >
</template>
<script>
import { namedFunction as externalFunction } from "./functions";
import { SomeClass } from "./class";
const arrowFunction = () => {
  return "defaultClassName";
};
const conditionFn = (cell) => {
  return cell.visible;
};
const getValue = (cell) => cell.text;
const array = new Array(100).map((_, index) => index);
const CLASS_NAME = arrowFunction();
export const WidgetProps = {
  cells: {
    type: Array,
    default() {
      return [];
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

export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  data() {
    return {
      global_CLASS_NAME: CLASS_NAME,
      global_externalFunction: externalFunction,
      global_conditionFn: conditionFn,
      global_getValue: getValue,
      global_SomeClass: SomeClass,
      global_array: array,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { cells: this.cells };
    },
  },
  methods: {
    __addPostfix(index) {
      return `_#${index}`;
    },
    __processStyle(value) {
      return normalizeStyles(value);
    },
  },
};
export default DxWidget;
</script>
