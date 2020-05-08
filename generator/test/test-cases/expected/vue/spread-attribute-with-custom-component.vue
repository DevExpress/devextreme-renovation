<template>
  <InnerWidget 
    :selected="false" 
    v-bind="__attr1()"
   />
</template>
<script>
import InnerWidget from "./dx-inner-widget";

export const WidgetInput = {};

export default {
  components: {
    InnerWidget
  },
  props: WidgetInput,
  methods: {
    __attr1() {
      return { value: 100, selected: true };
    },
    __restAttributes() {
      return {};
    }
  }
};
</script>
