<template>
  <div
    ><slot name="headerTemplate">
      <div style="display: contents;">{{ null }}</div> </slot
    ><slot
      name="contentTemplate"
      v-bind:data="{ p1: 'value' }"
      v-bind:index="10"
      v-if="$scopedSlots.contentTemplate"
    >
      <div
        style="display: contents;"
        :setdata="(data = { p1: 'value' })"
        :setindex="(index = 10)"
        ><div>{{ data.p1 }}</div></div
      > </slot
    ><slot
      name="template"
      v-bind:textProp="'textPropValue'"
      v-bind:textPropExpr="'textPropExrpValue'"
      v-if="!viewModel.props.contentTemplate"
    >
      <div
        style="display: contents;"
        :settextProp="(textProp = 'textPropValue')"
        :settextPropExpr="(textPropExpr = 'textPropExrpValue')"
        ><div></div
      ></div> </slot
    ><slot
      name="footerTemplate"
      v-bind:someProp="viewModel.props.someProp"
      v-if="viewModel.props.footerTemplate"
    >
      <div
        style="display: contents;"
        :setsomeProp="(someProp = viewModel.props.someProp)"
        ><div></div
      ></div> </slot
    ><slot name="componentTemplate" v-bind:value="'Test Value'"></slot
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
};
export const DxWidget = {
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
        headerTemplate: this.$scopedSlots.headerTemplate,
        template: this.$scopedSlots.template,
        contentTemplate: this.$scopedSlots.contentTemplate,
        footerTemplate: this.$scopedSlots.footerTemplate,
        componentTemplate: this.$scopedSlots.componentTemplate,
      };
    },
  },
};
export default DxWidget;
</script>
