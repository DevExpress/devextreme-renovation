<template>
  <div
    ><Widget v-bind="{ ...rest, ...{ children: undefined } }"
      ><slot></slot></Widget
  ></div>
</template>
<script>
import Widget from "./slots";
const WidgetInput = {};
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
      return { children: this.$slots.default };
    },
    rest() {
      const { ...rest } = this.props;
      return rest;
    },
  },
};
export default DxSlotPass;
</script>
