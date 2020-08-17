<template>
  <span></span>
</template>
<script>
const P1Context = (value = 5) => {
  return {
    value,
  };
};
const Props = {
  p1: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxWidget = {
  props: Props,
  computed: {
    __sum() {
      return this.provider.value + this.context.value;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { p1: this.p1 };
    },
  },
  inject: ["context"],
  provide() {
    return {
      provider: P1Context(10),
    };
  },
};
export default DxWidget;
</script>
