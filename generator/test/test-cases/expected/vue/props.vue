<template>
  <span></span>
</template>
<script>
const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  export: {
    type: Object,
    default() {
      return {};
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        export: this.export,
        onClick: this.onClick,
      };
    },
  },
  methods: {
    __getHeight() {
      this.onClick(10);
      this.onClick(11);
      return this.height;
    },
    onClick(...args) {
      this.$emit("click", ...args);
    },
  },
};
export default DxWidget;
</script>
