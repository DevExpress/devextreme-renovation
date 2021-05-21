<template>
  <div
    ><HelperWidget
      :forwardRef="this.$refs.forwardRef"
      :someRef="this.$refs.someRef"
      :refProp="refProp && refProp() ? refProp() : undefined"
      :forwardRefProp="
        forwardRefProp && forwardRefProp() ? forwardRefProp() : undefined
      "
    ></HelperWidget
  ></div>
</template>
<script>
import HelperWidget from "./refs-as-attribute-helper";
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
  components: {
    HelperWidget,
  },
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
