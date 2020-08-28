<template>
  <div></div>
</template>
<script>
export const WidgetProps = {
  str: {
    type: String,
    default() {
      return "";
    },
  },
  num: {
    type: Number,
    default() {
      return 1;
    },
  },
  bool: {
    type: Boolean,
    default() {
      return true;
    },
  },
  arr: {
    type: Array,
    default() {
      return [];
    },
  },
  strArr: {
    type: Array,
    default() {
      return ["a", "b"];
    },
  },
  obj: {
    type: Object,
    default() {
      return {};
    },
  },
  date: {
    type: Date,
    default() {
      return new Date();
    },
  },
  func: {
    type: Function,
    default: () => {},
  },
  symbol: {
    type: Symbol,
    default() {
      return Symbol("x");
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
      return {
        str: this.str,
        num: this.num,
        bool: this.bool,
        arr: this.arr,
        strArr: this.strArr,
        obj: this.obj,
        date: this.date,
        func: this.func,
        symbol: this.symbol,
      };
    },
  },
};
export default DxWidget;
</script>
