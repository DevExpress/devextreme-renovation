<template>
  <span></span>
</template>
<script>
const P1Context = (value = 5) => {
  return {
    value,
  };
};
const GetterContext = (value = "default") => {
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
    __contextProvider() {
      return "provide";
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { p1: this.p1 };
    },
  },
  inject: {
    context: {
      from: "P1Context",
      default: P1Context(),
    },
  },
  provide() {
    return {
      P1Context: P1Context(10),
      GetterContext: GetterContext(undefined),
    };
  },
  created() {
    this.provider = this._provided.P1Context;
    this.__contextProvider = this._provided.GetterContext;
  },
};
export default DxWidget;
</script>
