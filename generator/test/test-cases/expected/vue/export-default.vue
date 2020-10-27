<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  prop: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { ...(this.prop !== undefined && { prop: this.prop }) };
    },
  },
};
export default DxWidget;
</script>
