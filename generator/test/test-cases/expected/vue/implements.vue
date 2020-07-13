<template>
  <span />
</template>
<script>
import BaseProps from "./component-bindings-only";

const WidgetInput = {
  ...BaseProps,
  p: {
    type: String,
    default() {
      return "10";
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
      return { p: this.p, height: this.height };
    },
  },
  methods: {
    __onClick() {},
  },
};
</script>
