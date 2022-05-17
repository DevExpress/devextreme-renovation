<template>
  <div
    ><slot :name="template" v-bind="__spreadGetter">
      <div style="display: contents" :set="(templateDefault = {})"
        ><div></div
      ></div> </slot
    ><slot :name="template2" v-bind="PropFromClass">
      <div style="display: contents" :set="(template2Default = {})"
        ><div>{{ template2Default.inputInt }}</div></div
      > </slot
    ><slot :name="template2" v-bind="PropFromInterface">
      <div style="display: contents" :set="(template2Default = {})"
        ><div>{{ template2Default.inputInt }}</div></div
      > </slot
    ><slot :name="template2" v-bind="PropFromImportedInterface">
      <div style="display: contents" :set="(template2Default = {})"
        ><div>{{ template2Default.inputInt }}</div></div
      > </slot
    ><slot :name="template2" v-bind="PropFromImportedType">
      <div style="display: contents" :set="(template2Default = {})"
        ><div>{{ template2Default.inputInt }}</div></div
      >
    </slot></div
  >
</template>
<script>
const Props = {
  PropFromClass: {
    required: true,
  },
  PropFromInterface: {
    type: Object,
    required: true,
  },
  PropFromImportedInterface: {
    required: true,
  },
  PropFromImportedType: {
    required: true,
  },
  template: {
    type: String,
    default() {
      return "template";
    },
  },
  template2: {
    type: String,
    default() {
      return "template2";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: Props,
  computed: {
    __spreadGetter() {
      return { width: "40px", height: "30px" };
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        PropFromClass: this.PropFromClass,
        PropFromInterface: this.PropFromInterface,
        PropFromImportedInterface: this.PropFromImportedInterface,
        PropFromImportedType: this.PropFromImportedType,
        template: this.template,
        template2: this.template2,
      };
    },
  },
};
export default DxWidget;
</script>
