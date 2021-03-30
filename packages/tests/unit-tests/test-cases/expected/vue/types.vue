<template>
  <div></div>
</template>
<script>
import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
} from "./types-external";
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
  externalEnum: {
    default() {
      return "data";
    },
  },
  externalUnion: {
    default() {
      return 0;
    },
  },
  externalObj: {
    default() {
      return { number: 0, text: "text" };
    },
  },
  externalArray: {
    default() {
      return ["s1", "s2"];
    },
  },
  externalString: {
    default() {
      return "someValue";
    },
  },
};
export const DxWidget = {
  name: "Widget",
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
        externalEnum: this.externalEnum,
        externalUnion: this.externalUnion,
        externalObj: this.externalObj,
        externalArray: this.externalArray,
        externalString: this.externalString,
      };
    },
  },
};
export default DxWidget;
</script>
