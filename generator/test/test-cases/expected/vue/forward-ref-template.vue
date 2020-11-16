<template>
  <div style="display: contents"
    ><slot name="contentTemplate" v-bind:childRef="forwardRef_child"></slot
  ></div>
</template>
<script>
const Props = {};
export const DxRefOnChildrenTemplate = {
  name: "RefOnChildrenTemplate",
  props: Props,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { contentTemplate: this.$scopedSlots.contentTemplate };
    },
  },
  watch: {
    child: ["__schedule_effect"],
  },
  methods: {
    forwardRef_child(ref) {
      if (arguments.length) {
        this.$refs.child = ref;
      }
      return this.$refs.child;
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
  beforeDestroy() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  },
};
export default DxRefOnChildrenTemplate;
</script>
