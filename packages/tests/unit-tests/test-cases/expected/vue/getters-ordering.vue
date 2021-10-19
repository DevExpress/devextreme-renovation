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
  gridCompatibility: {
    type: Boolean,
    default() {
      return true;
    },
  },
  pageIndex: {
    type: Number,
    default() {
      return 1;
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  data() {
    return {
      pageIndex_state: this.pageIndex,
    };
  },
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
      return {
        someProp: this.someProp,
        type: this.type,
        ...(this.gridCompatibility !== undefined && {
          gridCompatibility: this.gridCompatibility,
        }),
        pageIndex: this.pageIndex_state,
        pageIndexChange: this.pageIndexChange,
      };
    },
  },
  watch: {
    someProp: ["__schedule_someEffect"],
    type: ["__schedule_someEffect"],
    pageIndex: ["__pageIndex_watcher"],
  },
  methods: {
    __pageIndexChange(newPageIndex) {
      if (this.gridCompatibility) {
        (this.pageIndex_state = newPageIndex + 1),
          this.pageIndexChange(this.pageIndex_state);
      } else {
        (this.pageIndex_state = newPageIndex),
          this.pageIndexChange(this.pageIndex_state);
      }
    },
    __someMethod() {
      return undefined;
    },
    __someEffect() {
      return () => this.__g7;
    },
    g3() {
      return [this.__g1, this.__g2];
    },
    pageIndexChange(...args) {
      this.$emit("update:page-index", ...args);
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
    __pageIndex_watcher(s) {
      this.pageIndex_state = s;
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
