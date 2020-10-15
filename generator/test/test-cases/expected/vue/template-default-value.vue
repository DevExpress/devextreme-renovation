<template>
  <div
    >TemplateDefaultValue<slot
      name="contentTemplate"
      v-bind:value="stringToRender"
      v-bind:number="21"
    >
      <div
        style="display: contents"
        :setvalue="(value = stringToRender)"
        :setnumber="(number = 21)"
        ><WidgetWithProps :value="value" :number="number"
      /></div> </slot
    ><slot name="contentTemplate" v-bind:value="''">
      <div style="display: contents" :setvalue="(value = '')"
        ><WidgetWithProps :value="value"
      /></div> </slot
    ><slot
      name="contentTemplate"
      v-bind:value="''"
      v-bind:optionalValue="'optional' + stringToRender"
    >
      <div
        style="display: contents"
        :setvalue="(value = '')"
        :setoptionalValue="(optionalValue = 'optional' + stringToRender)"
        ><WidgetWithProps :value="value" :optionalValue="optionalValue"
      /></div> </slot
  ></div>
</template>
<script>
import { DxWidgetWithProps as WidgetWithProps } from "./dx-widget-with-props";
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
    WidgetWithProps,
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
