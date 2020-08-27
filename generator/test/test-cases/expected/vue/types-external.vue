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
};
export const DxWidget = {
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
      };
    },
  },
};
export default DxWidget;
</script>
