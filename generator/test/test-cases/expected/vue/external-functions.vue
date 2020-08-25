<template>
  <div
    :key="simpleFunction(model.props.index)"
    v-bind:class="CLASS_NAME"
    v-bind:style="externalFunction()"
  ></div>
</template>
<script>
import { namedFunction as externalFunction } from "./functions";
function simpleFunction(index) {
  return `element_${index}`;
}
const arrowFunction = () => {
  return "defaultClassName";
};
const CLASS_NAME = arrowFunction();
export const WidgetProps = {
  index: {
    type: Number,
    default() {
      return 0;
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
      return { index: this.index };
    },
    externalFunction() {
      return externalFunction;
    },
    simpleFunction() {
      return simpleFunction;
    },
    arrowFunction() {
      return arrowFunction;
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
