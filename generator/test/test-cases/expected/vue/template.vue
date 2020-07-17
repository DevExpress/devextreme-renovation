<template>
  <div>
    <slot name="headerTemplate"></slot>
    <slot
      name="contentTemplate"
      v-bind:data="{ p1: 'value' }"
      v-bind:index="10"
      v-if="$scopedSlots.contentTemplate"
    ></slot>
    <slot
      name="template"
      v-bind:textProp="'textPropValue'"
      v-bind:textPropExpr="'textPropExrpValue'"
      v-if="!$scopedSlots.contentTemplate"></slot>
    <slot name="footerTemplate" v-bind:someProp="true"></slot>
  </div>
</template>

<script>
export const WidgetInput = {};

export default {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        headerTemplate: this.$scopedSlots.headerTemplate,
        template: this.$scopedSlots.template,
        contentTemplate: this.$scopedSlots.contentTemplate,
        footerTemplate: this.$scopedSlots.footerTemplate,
      };
    },
  },
};
</script>
