<template>
  <div>
    <div>
      <slot name="namedSlot"></slot>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
const WidgetInput = {};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        namedSlot: this.$slots.namedSlot,
        children: this.$slots.default,
      };
    },
  },
};
export default DxWidget;
</script>
