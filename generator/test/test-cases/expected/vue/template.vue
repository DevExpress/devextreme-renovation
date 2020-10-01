<template>
  <div
    ><slot name="headerTemplate"></slot
    ><slot
      name="contentTemplate"
      v-if="contentTemplate"
      v-bind:data="{ p1: 'value' }"
      v-bind:index="10"
      v-if="$scopedSlots.contentTemplate"
    ></slot>
    <slot name="contentTemplate" v-else>
      <div>{{ props.data.p1 }}</div> </slot
    ><slot
      name="template"
      v-if="template"
      v-bind:textProp="'textPropValue'"
      v-bind:textPropExpr="'textPropExrpValue'"
      v-if="!$scopedSlots.contentTemplate"
    ></slot>
    <slot name="template" v-else> <div></div> </slot
    ><slot
      name="footerTemplate"
      v-if="footerTemplate"
      v-bind:someProp="someProp"
    ></slot>
    <slot name="footerTemplate" v-else> <div></div> </slot
  ></div>
</template>
<script>
export const WidgetInput = {
  someProp: {
    type: Boolean,
    default() {
      return false;
    },
  },
};
export const DxWidget = {
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
      };
    },
  },
};
export default DxWidget;
</script>
