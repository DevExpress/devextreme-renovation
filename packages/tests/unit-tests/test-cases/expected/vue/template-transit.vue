<template>
  <WidgetWithTemplate
    ><template v-slot:template="slotProps"
      ><slot :name="templateProp" v-bind="slotProps"></slot></template
    ><template v-slot:componentTemplate="slotProps"
      ><slot :name="componentTemplateProp" v-bind="slotProps"></slot></template
  ></WidgetWithTemplate>
</template>
<script>
import WidgetWithTemplate from "./dx-widget-with-template";
export const TemplateTransitWidgetInput = {
  templateProp: {
    type: String,
    default() {
      return "templateProp";
    },
  },
  componentTemplateProp: {
    type: String,
    default() {
      return "componentTemplateProp";
    },
  },
};
export const DxTemplateTransitWidget = {
  name: "TemplateTransitWidget",
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
        templateProp: this.templateProp,
        componentTemplateProp: this.componentTemplateProp,
      };
    },
  },
};
export default DxTemplateTransitWidget;
</script>
