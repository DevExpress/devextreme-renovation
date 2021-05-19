<template>
  <div
    ><div
      >Ref:{{
        props === undefined || props === null ? undefined : props.someRef
      }}</div
    ><div
      >ForwardRef:{{
        props === undefined || props === null ? undefined : props.forwardRef
      }}</div
    ><div
      >RefProp:{{
        props === undefined || props === null ? undefined : props.refProp
      }}</div
    ><div
      >ForwardRefProp:{{
        props === undefined || props === null ? undefined : props.forwardRefProp
      }}</div
    ></div
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
