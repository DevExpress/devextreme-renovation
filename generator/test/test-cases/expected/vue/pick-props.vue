<template>
  <div>{{ height }}</div>
</template>
<script>
import Props from "./component-bindings-only";
const WidgetProps = {
  height: {
    type: Number,
    default() {
      return Props.height;
    },
  },
};
export default {
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { height: this.height };
    },
  },
};
</script>
