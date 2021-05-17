<template>
  <div
    ><div
      :someArg1="forwardRef && forwardRef() ? forwardRef() : undefined"
      :someArg2="someRef && someRef() ? someRef() : undefined"
      :someArg3="refProp?.()"
      :someArg4="forwardRefProp ? forwardRefProp()?.nativeElement : undefined"
    ></div
  ></div>
</template>
<script>
const WidgetProps = {
  refProp: {
    type: Function,
  },
  forwardRefProp: {
    type: Function,
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __forwardRefCurrent() {
      return this.$refs.forwardRef;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { refProp: this.refProp, forwardRefProp: this.forwardRefProp?.() };
    },
  },
  methods: {
    forwardRef_forwardRef(ref) {
      if (arguments.length) {
        this.$refs.forwardRef = ref;
      }
      return this.$refs.forwardRef;
    },
    forwardRef_forwardRefProp(ref) {
      if (arguments.length) {
        this.$refs.forwardRefProp = ref;
        this.forwardRefProp?.(ref);
      }
      return this.$refs.forwardRefProp;
    },
    __forwardRef() {},
  },
  mounted() {
    this.__forwardRef();
  },
  updated() {
    this.__forwardRef();
  },
};
export default DxWidget;
</script>
