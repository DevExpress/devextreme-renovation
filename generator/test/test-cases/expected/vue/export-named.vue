<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  prop: {
    type: Boolean,
  },
};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { prop: this.prop };
    },
  },
};
export default DxWidget;
</script>
