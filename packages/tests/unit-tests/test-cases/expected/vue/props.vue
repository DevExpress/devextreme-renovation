<template>
  <span
    >{{ (sizes ?? { width: 0, height: 0 }).height
    }}{{ (sizes ?? { width: 0, height: 0 }).width }}</span
  >
</template>
<script>
export const WidgetInput = {
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
  sizes: {
    type: Object,
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        export: this.export,
        sizes: this.sizes,
        onClick: this.onClick,
        onSomething: this.onSomething,
      };
    },
  },
  methods: {
    __getHeight() {
      this.onClick(10);
      this.onClick(11);
      return this.height;
    },
    __getRestProps() {
      const { height, onClick, ...rest } = this.props;
      return rest;
    },
    onClick(...args) {
      this.$emit("click", ...args);
    },
    onSomething(...args) {
      this.$emit("something", ...args);
    },
  },
};
export default DxWidget;
</script>
