<template>
  <div></div>
</template>
<script>
export const WidgetProps = {
  data: {
    type: String,
    default() {
      return "data";
    },
  },
  union: {
    type: [String, Number],
    default() {
      return "uniontext";
    },
  },
  obj: {
    type: Object,
    default() {
      return { number: 123, text: "sda" };
    },
  },
  strArr: {
    type: Array,
    default() {
      return ["ba", "ab"];
    },
  },
  s: {
    type: String,
    default() {
      return "";
    },
  },
  strDate: {
    type: [String, Date],
    default() {
      return new Date();
    },
  },
  customTypeField: {
    type: Array,
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
        data: this.data,
        union: this.union,
        obj: this.obj,
        strArr: this.strArr,
        s: this.s,
        strDate: this.strDate,
        customTypeField: this.customTypeField,
      };
    },
  },
};
export default DxWidget;
</script>
