<template>
  <div
    ><Widget v-bind="{ ...rest, ...{ children: undefined } }"
      ><slot></slot></Widget
  ></div>
</template>
<script>
import Widget from "./slots";
const WidgetInput = {
  p: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxSlotPass = {
  name: "SlotPass",
  components: {
    Widget,
  },
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { p: this.p, children: this.$slots.default };
    },
    rest() {
      const { p, ...rest } = this.props;
      return rest;
    },
  },
};
export default DxSlotPass;
</script>
