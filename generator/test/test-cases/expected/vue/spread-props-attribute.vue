 <template>
  <InnerWidget v-bind="props" />
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
  }
};

export default {
  components: {
    InnerWidget
  },
  props: WidgetInput,
  data() {
    return {
      value_state: undefined
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    valueChange(...args){
      this.$emit("value-change", ...args);
    }
  }
};
</script>
        