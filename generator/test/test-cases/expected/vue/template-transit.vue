<template>
  <WidgetWithTemplate>
    <template v-slot:template="slotProps">
      <slot name="templateProp" v-bind="slotProps"></slot>
    </template>
    <template v-slot:componentTemplate="slotProps">
      <slot name="componentTemplateProp" v-bind="slotProps"></slot>
    </template>
  </WidgetWithTemplate>
</template>
<script>
import WidgetWithTemplate from "./dx-widget-with-template";

export const TemplateTransitWidgetInput = {};
export default {
  components: {
    WidgetWithTemplate,
  },
  props: TemplateTransitWidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        templateProp: this.$scopedSlots.templateProp,
        componentTemplateProp: this.$scopedSlots.componentTemplateProp,
      };
    },
  },
};
</script>
