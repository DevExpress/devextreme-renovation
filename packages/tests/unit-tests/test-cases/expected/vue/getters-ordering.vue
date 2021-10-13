<template>
  <div></div>
</template>
<script>
const WidgetProps = {
  someProp: {
    type: String,
    default() {
      return "";
    },
  },
  type: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __g7() {
      return this.__g6;
    },
    __g5() {
      return [...this.g3(), this.__g2];
    },
    __g1() {
      return this.someProp;
    },
    __g2() {
      return this.type;
    },
    __g4() {
      return [...this.g3(), this.__g1];
    },
    __g6() {
      return [...this.__g5, ...this.__g4];
    },
    __type() {
      return this.type;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { someProp: this.someProp, type: this.type };
    },
  },
  watch: {
    someProp: ["__schedule_someEffect"],
    type: ["__schedule_someEffect"],
  },
  methods: {
    __someEffect() {
      return () => this.__g7;
    },
    g3() {
      return [this.__g1, this.__g2];
    },
    __schedule_someEffect() {
      this.__scheduleEffect(0, "__someEffect");
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
    this.__destroyEffects[0] = this.__someEffect();
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
export default DxWidget;
</script>
