<template>
  <span ></span>
</template>
<script>
const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    }
  }
};

export default {
  props: WidgetInput,
  methods: {
    getHeight() {
      this.onClick(10);

      this.onClick(11);
      return this.height;
    },
    __restAttributes() {
      return {};
    },

    onClick(...args) {
      this.$emit("on-click", ...args);
    }
  }
};
</script>
