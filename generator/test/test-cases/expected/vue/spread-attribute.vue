<template>
  <div ref="host" v-bind="__attr1"
    ><input v-bind="__attr2" /><input ref="i1" v-bind="__attr2" /><input
      v-bind="prop"
  /></div>
</template>
<script>
export const WidgetInput = {
  prop: {
    default() {
      return {};
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __attr1() {
      return {};
    },
    __attr2() {
      return {};
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { prop: this.prop };
    },
  },
};
export default DxWidget;
</script>
