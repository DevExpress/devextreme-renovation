<template>
  <div
    ><slot :name="headerTemplate">
      <div style="display: contents" :set="(headerTemplateDefault = {})">{{
        null
      }}</div> </slot
    ><slot
      :name="contentTemplate"
      v-bind:data="{ p1: 'value' }"
      v-bind:index="10"
      v-if="$scopedSlots[contentTemplate]"
    >
      <div
        style="display: contents"
        :set="(contentTemplateDefault = { data: { p1: 'value' }, index: 10 })"
        ><div>{{ contentTemplateDefault.data.p1 }}</div></div
      > </slot
    ><slot
      :name="template"
      v-bind:textProp="'textPropValue'"
      v-bind:textPropExpr="'textPropExrpValue'"
      v-if="!$scopedSlots[contentTemplate]"
    >
      <div
        style="display: contents"
        :set="
          (templateDefault = {
            textProp: 'textPropValue',
            textPropExpr: 'textPropExrpValue',
          })
        "
        ><div></div
      ></div> </slot
    ><slot
      :name="footerTemplate"
      v-bind:someProp="someProp"
      v-if="$scopedSlots[footerTemplate]"
    >
      <div
        style="display: contents"
        :set="(footerTemplateDefault = { someProp: myvar })"
        ><div></div
      ></div> </slot
    ><slot :name="componentTemplate" v-bind:value="'Test Value'">
      <div
        style="display: contents"
        :set="(componentTemplateDefault = { value: 'Test Value' })"
        ><WidgetWithProps :value="componentTemplateDefault.value"
      /></div> </slot
  ></div>
</template>
<script>
import {
  WidgetWithPropsInput,
  DxWidgetWithProps as WidgetWithProps,
} from "./dx-widget-with-props";
export const WidgetInput = {
  someProp: {
    type: Boolean,
    default() {
      return false;
    },
  },
  headerTemplate: {
    type: String,
    default() {
      return "headerTemplate";
    },
  },
  template: {
    type: String,
    default() {
      return "template";
    },
  },
  contentTemplate: {
    type: String,
    default() {
      return "contentTemplate";
    },
  },
  footerTemplate: {
    type: String,
    default() {
      return "footerTemplate";
    },
  },
  componentTemplate: {
    type: String,
    default() {
      return "componentTemplate";
    },
    defaultTemplate() {
      return WidgetWithProps;
    },
  },
};
export const DxWidgetWithTemplate = {
  name: "WidgetWithTemplate",
  components: {
    WidgetWithProps,
  },
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        someProp: this.someProp,
        headerTemplate: this.headerTemplate,
        template: this.template,
        contentTemplate: this.contentTemplate,
        footerTemplate: this.footerTemplate,
        componentTemplate: this.componentTemplate,
      };
    },
  },
};
export default DxWidgetWithTemplate;
</script>
