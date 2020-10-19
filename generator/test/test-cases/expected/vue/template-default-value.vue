<template>
  <div
    >TemplateDefaultValue<slot
      name="defaultCompTemplate"
      v-bind:optionalValue="stringToRender"
      v-bind:value="'twdComp'"
    >
      <div
        style="display: contents"
        :set="
          (defaultCompTemplateDefault = {
            optionalValue: stringToRender,
            value: 'twdComp',
          })
        "
        ><WidgetWithProps
          :optionalValue="defaultCompTemplateDefault.optionalValue"
          :value="defaultCompTemplateDefault.value"
      /></div> </slot
    ><slot name="defaultCompTemplate" v-bind:optionalValue="stringToRender">
      <div
        style="display: contents"
        :set="(defaultCompTemplateDefault = { optionalValue: stringToRender })"
        ><WidgetWithProps
          :optionalValue="defaultCompTemplateDefault.optionalValue"
      /></div> </slot
    ><slot name="defaultFuncTemplate" v-bind:optionalValue="stringToRender">
      <div
        style="display: contents"
        :set="(defaultFuncTemplateDefault = { optionalValue: stringToRender })"
        ><div
          >!DefaultFunc:{{
            defaultFuncTemplateDefault.value || "ftwdCompDefault"
          }}{{ defaultFuncTemplateDefault.optionalValue }}</div
        ></div
      >
    </slot></div
  >
</template>
<script>
import { DxWidgetWithProps as WidgetWithProps } from "./dx-widget-with-props";
export const TemplateDefaultValueProps = {
  stringToRender: {
    type: String,
    default() {
      return "strCompDefault";
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
        defaultCompTemplate: this.$scopedSlots.defaultCompTemplate,
        defaultFuncTemplate: this.$scopedSlots.defaultFuncTemplate,
        stringToRender: this.stringToRender,
      };
    },
  },
};
export default DxTemplateDefaultValue;
</script>
