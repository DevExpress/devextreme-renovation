<template>
  <span></span>
</template>
<script>
import Vue from "vue";
const P1Context = (value = 5) => {
  return Vue.observable({
    value,
  });
};
const GetterContext = (value = "default") => {
  return Vue.observable({
    value,
  });
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
  watch: {
    __contextProvider: ["provide__contextProvider"],
  },
  methods: {
    provide__contextProvider() {
      this._provided.GetterContext.value = this.__contextProvider;
    },
    __scheduleEffect(index, name) {
      if (!this.__scheduleEffects[index]) {
        this.__scheduleEffects[index] = () => {
          this.__destroyEffects[index] && this.__destroyEffects[index]();
          this.__destroyEffects[index] = this[name]();
          this.__scheduleEffects[index] = null;
        };
        this.$nextTick(
          () => this.__scheduleEffects[index] && this.__scheduleEffects[index]()
        );
      }
    },
  },
  created() {
    this.provider = this._provided.P1Context;
    this.provide__contextProvider();
  },
};
export default DxWidget;
</script>
