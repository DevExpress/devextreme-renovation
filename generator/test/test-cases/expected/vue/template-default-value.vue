<template>
  <div
    >TemplateDefaultValue<slot
      name="contentTemplate"
      v-bind:data="{ p1: stringToRender }"
      v-bind:index="5"
    >
      <div
        style="display: contents"
        :setdata="(data = { p1: stringToRender })"
        :setindex="(index = 5)"
        ><span>{{ data.p1 }}</span></div
      > </slot
    >ComponentTemplateDefaultValue<slot
      name="compTemplate"
      v-bind:value="model.props.stringToRender"
    ></slot
    ><slot
      name="compTemplate"
      v-bind:value="'I am 5 string'"
      v-bind:index="5"
    ></slot
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
        compTemplate: this.$scopedSlots.compTemplate,
      };
    },
  },
};
export default DxTemplateDefaultValue;
</script>
