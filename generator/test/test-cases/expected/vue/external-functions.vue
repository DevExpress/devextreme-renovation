<template>
  <div
    v-bind:class="global_CLASS_NAME"
    v-bind:style="__processStyle(global_externalFunction())"
    ><span :key="index" v-for="(cell, index) of cells"
      ><div v-if="global_conditionFn(cell) && index > 0"
        >{{ global_getValue(cell) }}{{ __addPostfix(index)
        }}{{ global_SomeClass.name }}</div
      ></span
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
const CLASS_NAME = arrowFunction();
export const WidgetProps = {
  cells: {
    type: Array,
    default() {
      return [];
    },
  },
};
export const DxWidget = {
  props: WidgetProps,
  data() {
    return {
      global_CLASS_NAME: CLASS_NAME,
      global_externalFunction: externalFunction,
      global_conditionFn: conditionFn,
      global_getValue: getValue,
      global_SomeClass: SomeClass,
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
      if (typeof value === "object") {
        return Object.keys(value).reduce((v, k) => {
          if (typeof value[k] === "number") {
            v[k] = value[k] + "px";
          } else {
            v[k] = value[k];
          }
          return v;
        }, {});
      }
      return value;
    },
  },
};
export default DxWidget;
</script>
