<template>
  <span></span>
</template>
<script>
export const WidgetInput = {
  someProp: {
    type: Object,
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  data() {
    return {
      someState: undefined,
      existsState: { current: "value" },
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { someProp: this.someProp };
    },
  },
  methods: {
    __concatStrings() {
      const fromProps = this.someProp?.current || "";
      const fromState = this.someState?.current || "";
      return `${fromProps}${fromState}${this.existsState.current}`;
    },
  },
};
export default DxWidget;
</script>
