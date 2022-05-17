<template>
  <div style="display: contents"
    ><WidgetWithTemplate
      ><template v-slot:componentTemplate="slotProps"
        ><InnerWidget
          :visible="slotProps.visible"
          :selected="slotProps.selected"
          :value="slotProps.value"
          :required="slotProps.required"
          @update:value="slotProps.valueChange" /></template
      ><template v-slot:template="{ text }"
        ><span>{{ text }}</span></template
      ><template v-slot:arrowTemplate="data"
        ><div>{{ data.name }}</div></template
      ></WidgetWithTemplate
    ><WidgetWithTemplate
      ><template v-slot:arrowTemplate="data"
        ><div>{{ data.id }}</div></template
      ></WidgetWithTemplate
    ></div
  >
</template>
<script>
import InnerWidget from "./dependency-props";
import WidgetWithTemplate from "./dx-widget-with-template";
export const WidgetProps = {};
export const DxWidget = {
  name: "Widget",
  components: {
    InnerWidget,
    WidgetWithTemplate,
  },
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
};
export default DxWidget;
</script>
