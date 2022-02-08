<template>
  <div
    >TemplateDefaultValue<slot
      :name="defaultCompTemplate"
      v-bind:optionalValue="stringToRender"
      v-bind:value="'twdComp'"
      v-bind:onClick="() => {}"
    >
      <div
        style="display: contents"
        :set="
          (defaultCompTemplateDefault = {
            optionalValue: stringToRender,
            value: 'twdComp',
            onClick: () => {},
          })
        "
        ><WidgetWithProps
          :optionalValue="defaultCompTemplateDefault.optionalValue"
          :value="defaultCompTemplateDefault.value"
          @click="defaultCompTemplateDefault.onClick"
      /></div> </slot
    ><slot :name="defaultCompTemplate" v-bind:value="stringToRender">
      <div
        style="display: contents"
        :set="(defaultCompTemplateDefault = { value: stringToRender })"
        ><WidgetWithProps :value="defaultCompTemplateDefault.value"
      /></div> </slot
    ><slot :name="defaultFuncTemplate" v-bind:value="stringToRender">
      <div
        style="display: contents"
        :set="(defaultFuncTemplateDefault = { value: stringToRender })"
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
  defaultCompTemplate: {
    type: String,
    default() {
      return "defaultCompTemplate";
    },
    defaultTemplate() {
      return WidgetWithProps;
    },
  },
  defaultFuncTemplate: {
    type: String,
    default() {
      return "defaultFuncTemplate";
    },
  },
  stringToRender: {
    type: String,
    default() {
      return "strCompDefault";
    },
  },
};
export const DxTemplateDefaultValue = {
  name: "TemplateDefaultValue",
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
        defaultCompTemplate: this.defaultCompTemplate,
        defaultFuncTemplate: this.defaultFuncTemplate,
        stringToRender: this.stringToRender,
      };
    },
  },
};
export default DxTemplateDefaultValue;
</script>
