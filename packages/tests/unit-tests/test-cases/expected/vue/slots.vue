<template>
  <div
    ><div><slot name="namedSlotWithSelector"></slot></div
    ><div><slot name="namedSlot"></slot></div><div><slot></slot></div
  ></div>
</template>
<script>
const SlotsWidgetProps = {};
export const DxSlotsWidget = {
  name: "SlotsWidget",
  props: SlotsWidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        namedSlot: this.$slots.namedSlot,
        namedSlotWithSelector: this.$slots.namedSlotWithSelector,
        children: this.$slots.default,
      };
    },
  },
};
export default DxSlotsWidget;
</script>
