<template>
  <div></div>
</template>
<script>
export const WidgetProps = {
  str: {
    type: Object,
    default() {
      return "";
    },
  },
  num: {
    type: Object,
    default() {
      return 1;
    },
  },
  bool: {
    type: Object,
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
    type: Object,
    default() {
      return new Date();
    },
  },
  func: {
    type: Object,
    default() {
      return () => {};
    },
  },
  symbol: {
    type: Object,
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
