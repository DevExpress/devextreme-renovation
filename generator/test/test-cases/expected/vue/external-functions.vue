<template>
  <div v-bind:class="CLASS_NAME" v-bind:style="externalFunction()">
    <span :key="index" v-for="(cell, index) of cells"
      ><div v-if="conditionFn(cell) && index > 0">{{ index }}</div></span
    >
  </div>
</template>
<script>
import { namedFunction as externalFunction } from "./functions";
const arrowFunction = () => {
  return "defaultClassName";
};
const conditionFn = (cell) => {
  return cell.visible;
};
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
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { cells: this.cells };
    },
    externalFunction() {
      return externalFunction;
    },
    arrowFunction() {
      return arrowFunction;
    },
    conditionFn() {
      return conditionFn;
    },
    CLASS_NAME() {
      return CLASS_NAME;
    },
  },
  methods: {
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
