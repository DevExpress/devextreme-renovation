<template>
  <div></div>
</template>
<script>
const WidgetProps = {
  someProp: {
    type: String,
    default() {
      return "";
    },
  },
  type: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __internalInterfaceGetter() {
      return { field1: { a: this.someProp }, field2: 2, field3: 3 };
    },
    __internalTypeGetter() {
      return { a: "1" };
    },
    __externalInterfaceGetter() {
      return { inputInt: 2 };
    },
    __externalTypeGetter() {
      return { value: "" };
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { someProp: this.someProp, type: this.type };
    },
  },
};
export default DxWidget;
</script>
