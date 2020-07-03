<template>
  <div style="display: contents;">
    <slot name="contentTemplate" v-bind:childRef="forwardRef_child"></slot>
  </div>
</template>
<script>
const Props = {};

export default {
  props: Props,

  watch: {
    child: ["__schedule_effect"],
  },
  methods: {
    __restAttributes() {
      return {};
    },
    forwardRef_child(ref) {
      this.$refs.child = ref;
    },
    props() {
      return { contentTemplate: this.$scopedSlots.contentTemplate };
    },
    __effect() {
      this.$refs.child.innerHTML += "ParentText";
    },
    __schedule_effect() {
      this.__scheduleEffect(0, "__effect");
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
  },
};
</script>
