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
};

export default {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
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
</script>
