<template>
  <div></div>
</template>
<script>
function subscribe(p, s, i) {
  return 1;
}
function unsubscribe(id) {
  return undefined;
}
export const WidgetInput = {
  p: {
    type: String,
    default() {
      return "10";
    },
  },
  r: {
    type: String,
    default() {
      return "20";
    },
  },
  s: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  data() {
    return {
      i: 10,
      j: 20,
      s_state: this.s,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { p: this.p, r: this.r, s: this.s_state, sChange: this.sChange };
    },
  },
  watch: {
    p: ["__schedule_setupData", "__schedule_alwaysEffect"],
    s_state: ["__schedule_setupData", "__schedule_alwaysEffect"],
    i: ["__schedule_setupData", "__schedule_alwaysEffect"],
    j: ["__schedule_alwaysEffect"],
    r: ["__schedule_alwaysEffect"],
    sChange: ["__schedule_alwaysEffect"],
    s: ["__s_watcher"],
  },
  methods: {
    __getP() {
      return this.p;
    },
    __setupData() {
      const id = subscribe(this.__getP(), this.s_state, this.i);
      this.i = 15;
      return () => unsubscribe(id);
    },
    __onceEffect() {
      const id = subscribe(this.__getP(), this.s_state, this.i);
      this.i = 15;
      return () => unsubscribe(id);
    },
    __alwaysEffect() {
      const id = subscribe(this.__getP(), 1, 2);
      return () => unsubscribe(id);
    },
    sChange(...args) {
      this.$emit("update:s", ...args);
    },
    __schedule_setupData() {
      this.__scheduleEffect(0, "__setupData");
    },
    __schedule_alwaysEffect() {
      this.__scheduleEffect(2, "__alwaysEffect");
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
    __s_watcher(s) {
      this.s_state = s;
    },
  },
  created() {
    this.__destroyEffects = [];
    this.__scheduleEffects = [];
  },
  mounted() {
    this.__destroyEffects[0] = this.__setupData();
    this.__destroyEffects[1] = this.__onceEffect();
    this.__destroyEffects[2] = this.__alwaysEffect();
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
