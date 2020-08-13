<template>
  <div>
    {{ baseStateProp_state }}
  </div>
</template>
<script>
const ModelWidgetInput = {
  baseStateProp: {
    type: Boolean,
  },
  modelStateProp: {
    type: Boolean,
  },
  value: {
    type: Boolean,
  },
};
export const DxModelWidget = {
  props: ModelWidgetInput,
  model: {
    prop: "modelStateProp",
    event: "update:model-state-prop",
  },
  data() {
    return {
      baseStateProp_state: this.baseStateProp,
      modelStateProp_state: this.modelStateProp,
      value_state: this.value,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        baseStateProp: this.baseStateProp_state,
        baseStatePropChange: this.baseStatePropChange,
        modelStateProp: this.modelStateProp_state,
        value: this.value_state,
        modelStatePropChange: this.modelStatePropChange,
        valueChange: this.valueChange,
      };
    },
  },
  watch: {
    baseStateProp: ["__baseStateProp_watcher"],
    modelStateProp: ["__modelStateProp_watcher"],
    value: ["__value_watcher"],
  },
  methods: {
    baseStatePropChange(...args) {
      this.$emit("update:base-state-prop", ...args);
    },
    modelStatePropChange(...args) {
      this.$emit("update:model-state-prop", ...args);
    },
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    __baseStateProp_watcher(s) {
      this.baseStateProp_state = s;
    },
    __modelStateProp_watcher(s) {
      this.modelStateProp_state = s;
    },
    __value_watcher(s) {
      this.value_state = s;
    },
  },
};
export default DxModelWidget;
</script>
