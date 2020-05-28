<template>
  <WidgetWithTemplate
    :template="CustomTemplate"
    :componentTemplate="InnerWidget"
  >
    <template v-slot:componentTemplate="slotProps" >
      <InnerWidget
        :selected="slotProps.selected"
        :value="slotProps.value"
        @on-select="slotProps.onSelect"
        :defaultValue="slotProps.defaultValue"
        @update:value="slotProps.valueChange"
      />
    </template>
    <template v-slot:template="{text}" >
      <span >{{text}}</span>
    </template>
  </WidgetWithTemplate>
</template>
<script>

import WidgetWithTemplate from "./dx-widget-with-template"
import InnerWidget from "./dx-inner-widget"

export const WidgetProps = { };
export default {
  components: {
    WidgetWithTemplate,
    InnerWidget
  },
  props: WidgetProps,
  methods: {
    __restAttributes(){
      return {}
    },
    props(){
      return {};
    }
  }
}
</script>