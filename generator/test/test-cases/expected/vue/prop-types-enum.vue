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
      };
    },
  },
};
export default DxWidget;
</script>
