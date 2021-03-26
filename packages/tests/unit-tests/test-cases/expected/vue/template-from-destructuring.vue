<template>
  <div style="display: contents">
    <slot name="contentTemplate">
      <div style="display: contents" :set="(contentTemplateDefault = {})">
        <div />
      </div>
    </slot>
  </div>
</template>
<script>
export const Props = {};
export const DxTestComponent = {
  name: "TestComponent",
  props: Props,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { contentTemplate: this.$scopedSlots.contentTemplate };
    },
  },
};
export default DxTestComponent;
</script>
