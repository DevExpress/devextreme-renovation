<template>
  <div
    >TemplateDefaultValue<slot name="contentTemplate">
      <div style="display: contents"><SampleWidget /></div> </slot
    ><slot name="contentTemplate" v-bind:text="stringToRender">
      <div style="display: contents" :settext="(text = stringToRender)"
        ><SampleWidget :text="text"
      /></div> </slot
    ><slot name="contentTemplate" v-bind:textWithDefault="stringToRender">
      <div
        style="display: contents"
        :settextWithDefault="(textWithDefault = stringToRender)"
        ><SampleWidget :textWithDefault="textWithDefault"
      /></div> </slot
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
