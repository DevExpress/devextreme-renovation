 <template>
  <div>{{(baseStateProp !== undefined ? baseStateProp : baseStateProp_state)}}</div>
</template>
<script>
const ModelWidgetInput = {
  baseStateProp: {
    type: Boolean,
    default: undefined
  },
  modelStateProp: {
    type: Boolean,
    default: undefined
  },
  value: {
    type: Boolean,
    default: undefined
  },
  defaultBaseStateProp: {
    type: Boolean
  },
  defaultModelStateProp: {
    type: Boolean
  },
  defaultValue: {
    type: Boolean
  }
};
export default {
  props: ModelWidgetInput,
  model: {
    prop: "modelStateProp",
    event: "update:model-state-prop"
  },
  data() {
    return {
      baseStateProp_state: this.defaultBaseStateProp,
      modelStateProp_state: this.defaultModelStateProp,
      value_state: this.defaultValue
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    baseStatePropChange(...args){
      this.$emit("update:base-state-prop", ...args);
    },
    modelStatePropChange(...args){
      this.$emit("update:model-state-prop", ...args);
    },
    valueChange(...args){
      this.$emit("update:value", ...args);
    }
  }
};
</script>
