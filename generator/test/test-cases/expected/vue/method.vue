<template>
  <div ref="divRef"></div>
</template>
<script>
const WidgetInput = {
  prop1: {
    type: Number,
  },
  prop2: {
    type: Number,
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
      return { prop1: this.prop1, prop2: this.prop2 };
    },
  },
  methods: {
    getHeight(p = 10, p1) {
      return `${this.prop1} + ${this.prop2} + ${this.$refs.divRef.innerHTML} + ${p}`;
    },
    getSize() {
      return `${this.prop1} + ${this.$refs.divRef.innerHTML} + ${this.getHeight(
        0,
        0
      )}`;
    },
  },
};
export default DxWidget;
</script>
