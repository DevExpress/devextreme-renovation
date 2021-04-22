<template>
  <div style="display: contents"
    ><slot :name="contentTemplate">
      <div style="display: contents" :set="(contentTemplateDefault = {})"
        ><div
      /></div> </slot
  ></div>
</template>
<script>
export const Props = {
  contentTemplate: {
    type: String,
    default() {
      return "contentTemplate";
    },
  },
};
export const DxTestComponent = {
  name: "TestComponent",
  props: Props,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { contentTemplate: this.contentTemplate };
    },
  },
};
export default DxTestComponent;
</script>
