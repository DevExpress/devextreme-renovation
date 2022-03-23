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
import { normalizeStyles } from "@devextreme/runtime/vue";

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
