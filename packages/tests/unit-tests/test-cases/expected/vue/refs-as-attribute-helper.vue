<template>
  <div
    ><div>Ref:{{ someRef }}</div
    ><div>ForwardRef:{{ forwardRef }}</div
    ><div>RefProp:{{ refProp }}</div
    ><div>ForwardRefProp:{{ forwardRefProp }}</div></div
  >
</template>
<script>
const HelperWidgetProps = {
  forwardRef: {
    type: [HTMLDivElement],
  },
  someRef: {
    type: [HTMLDivElement],
  },
  refProp: {
    type: [HTMLDivElement],
  },
  forwardRefProp: {
    type: [HTMLDivElement],
  },
};
export const DxHelperWidget = {
  name: "HelperWidget",
  props: HelperWidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        forwardRef: this.forwardRef,
        someRef: this.someRef,
        refProp: this.refProp,
        forwardRefProp: this.forwardRefProp,
      };
    },
  },
};
export default DxHelperWidget;
</script>
