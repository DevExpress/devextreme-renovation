<template>
  <div></div>
</template>
<script>
const WidgetInput = {};
export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  data() {
    return {
      obj: {
        type: Object,
        required: true,
      },
      notDefinedObj: {
        type: Object,
      },
      definedObj: {
        type: Object,
        default() {
          return { value: 0 };
        },
      },
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  watch: {
    notDefinedObj: ["__schedule_initialize"],
  },
  methods: {
    __setObj() {
      this.obj.value = 0;
      this.definedObj.value = 0;
      this.notDefinedObj = this.notDefinedObj || {};
      this.notDefinedObj.value = 0;
    },
    __getValue() {
      const a = this.obj.value ?? 0;
      const b = this.notDefinedObj?.value ?? 0;
      const c = this.definedObj.value ?? 0;
      return a + b + c;
    },
    __getObj() {
      return this.obj;
    },
    __destruct() {
      const { definedObj, notDefinedObj, obj } = this;
      const a = obj.value;
      const b = definedObj.value;
      const c = notDefinedObj?.value;
    },
    __initialize() {
      this.__setObj();
    },
    __schedule_initialize() {
      this.__scheduleEffect(0, "__initialize");
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
    this.__destroyEffects[0] = this.__initialize();
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
