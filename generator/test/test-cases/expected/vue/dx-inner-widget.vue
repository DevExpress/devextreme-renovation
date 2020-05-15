  <template>
  <div v-bind:style="__processStyle({
        width:100,
        height:100
    })"></div>
</template>
<script>
export const InnerWidgetProps = {
  selected: {
    type: Boolean
  },
  value: {
    type: Number,
    default: undefined
  },
  defaultValue: {
    type: Number
  }
};
export default {
  props: InnerWidgetProps,
  model: {
    prop: "value",
    event: "update:value"
  },
  data() {
    return {
      value_state: this.defaultValue
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    __processStyle(value) {
      if (typeof value === "object") {
        return Object.keys(value).reduce((v, k) => {
          if (typeof value[k] === "number") {
            v[k] = value[k] + "px";
          } else {
            v[k] = value[k];
          }
          return v;
        }, {});
      }
      return value;
    },
    onSelect(...args){
      this.$emit("on-select", ...args);
    },
    valueChange(...args){
      this.$emit("update:value", ...args);
    }
  }
};
</script>