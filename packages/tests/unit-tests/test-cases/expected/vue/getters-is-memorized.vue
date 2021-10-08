<template>
  <div></div>
</template>
<script>
import { Item as externalType } from "./globals-in-template";
import { PropsI as externalInterface } from "./implements";
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
      return { p: "" };
    },
    __externalTypeGetter() {
      return { text: "", key: 0 };
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
