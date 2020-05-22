 <template>
  <div>{{(value !== undefined ? value : value_state)}}</div>
</template>
<script>
const ModelWidgetInput = {
  disabled: {
    type: Boolean
  },
  value: {
    type: Boolean,
    default: undefined
  },
  notValue: {
    type: Boolean,
    default: undefined
  },
  defaultValue: {
    type: Boolean
  },
  defaultNotValue: {
    type: Boolean
  }
};
export default {
  props: ModelWidgetInput,
  model: {
    prop: "value",
    event: "update:value"
  },
  data() {
    return {
      value_state: this.defaultValue,
      notValue_state: this.defaultNotValue
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    valueChange(...args){
      this.$emit("update:value", ...args);
    },
    notValueChange(...args){
      this.$emit("update:not-value", ...args);
    }
  }
};
</script>
