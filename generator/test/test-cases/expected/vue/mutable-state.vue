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
