<template>
  <Child
    :childRef="(ref=>{
                this.$refs.child = ref
            })"
  />
</template>
<script>
import Child from "./child";

const Props = {};

export default {
  components: {
    Child
  },
  props: Props,
  methods: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
    __effect() {
      this.$refs.child.innerHTML = "Ref from child";
    }
  },
  created() {
    this.__destroyEffects = [];
    this.__scheduleEffects = [];
  },
  mounted() {
    this.__destroyEffects[0] = this.__effect();
  },
  updated() {
    this.__scheduleEffects.forEach((_, i) => {
      this.__scheduleEffects[i] && this.__scheduleEffects[i]();
    });
  },
  destroyed() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  }
};
</script>
        