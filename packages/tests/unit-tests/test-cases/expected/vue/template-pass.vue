<template>
  <div style="display: contents"
    ><WidgetWithTemplate
      ><template v-slot:componentTemplate="slotProps"
        ><InnerWidget
          :selected="slotProps.selected"
          :value="slotProps.value"
          @select="slotProps.onSelect"
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
import WidgetWithTemplate from "./dx-widget-with-template";
import InnerWidget from "./dx-inner-widget";
export const WidgetProps = {};
export const DxWidget = {
  name: "Widget",
  components: {
    WidgetWithTemplate,
    InnerWidget,
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
