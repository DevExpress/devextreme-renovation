<template>
  <div
    >TemplateDefaultValue<slot
      name="contentTemplate"
      v-bind:data="{ p1: stringToRender }"
    >
      <div style="display: contents" :setdata="(data = { p1: stringToRender })"
        ><span>{{ data.p1 }}</span></div
      >
    </slot></div
  >
</template>
<script>
export const TemplateDefaultValueProps = {
  stringToRender: {
    type: String,
    default() {
      return "default string";
    },
  },
};
export const DxTemplateDefaultValue = {
  props: TemplateDefaultValueProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        contentTemplate: this.$scopedSlots.contentTemplate,
        stringToRender: this.stringToRender,
      };
    },
  },
};
export default DxTemplateDefaultValue;
</script>
