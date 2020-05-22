 <template>
  <InnerWidget v-bind="props()" />
</template>
<script>
import InnerWidget from "./dx-inner-widget";

export const WidgetInput = {
  visible: {
    type: Boolean
  },
  value: {
    type: Boolean,
    default: undefined
  },
  defaultValue: {
    type: Boolean
  }
};

export default {
  components: {
    InnerWidget
  },
  props: WidgetInput,
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
    props(){
      return {visible:this.visible,
        value:(this.value !== undefined ? this.value : this.value_state),
        valueChange:this.valueChange
      };
    },
    valueChange(...args){
      this.$emit("update:value", ...args);
    }
  }
};
</script>
        