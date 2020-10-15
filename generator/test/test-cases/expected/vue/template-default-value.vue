<template>
  <div
    >TemplateDefaultValue<slot name="contentTemplate"></slot
    ><slot name="contentTemplate" v-bind:text="stringToRender"></slot
    ><slot name="contentTemplate" v-bind:textWithDefault="stringToRender"></slot
  ></div>
</template>
<script>
import SampleWidget from "./sample-widget";
export const TemplateDefaultValueProps = {
  stringToRender: {
    type: String,
    default() {
      return "default string";
    },
  },
};
export const DxTemplateDefaultValue = {
  components: {
    SampleWidget,
  },
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
