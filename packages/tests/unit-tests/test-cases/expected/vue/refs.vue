<template>
  <div ref="divRef"><div ref="outerDivRef"></div></div>
</template>
<script>
const WidgetProps = {
  outerDivRef: {
    type: Function,
  },
  refProp: {
    type: Function,
  },
  forwardRefProp: {
    type: Function,
  },
  requiredRefProp: {
    type: Function,
    required: true,
  },
  requiredForwardRefProp: {
    type: Function,
    required: true,
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        outerDivRef: this.outerDivRef?.(),
        refProp: this.refProp,
        forwardRefProp: this.forwardRefProp?.(),
        requiredRefProp: this.requiredRefProp,
        requiredForwardRefProp: this.requiredForwardRefProp?.(),
      };
    },
  },
  methods: {
    __writeRefs() {
      let someRef;
      if (this.refProp) {
        someRef = this.refProp();
      }
      if (this.refProp?.()) {
        someRef = this.refProp();
      }
      if (this.forwardRefProp) {
        someRef = this.forwardRefProp();
      }
      if (this.forwardRefProp?.()) {
        someRef = this.forwardRefProp();
      }
      someRef = this.outerDivRef();
      if (this.forwardRefProp && !this.forwardRefProp()) {
        this.forwardRef_forwardRefProp(this.$refs.divRef),
          this.forwardRefProp(this.$refs.divRef);
      }
    },
    __readRefs() {
      const outer_1 = this.refProp?.()?.outerHTML;
      const outer_2 = this.forwardRefProp?.()?.outerHTML;
      const outer_3 = this.$refs.ref?.outerHTML;
      const outer_4 = this.$refs.forwardRef?.outerHTML;
      const outer_5 = this.$refs.existingRef?.outerHTML;
      const outer_6 = this.$refs.existingForwardRef?.outerHTML;
      const outer_7 = this.requiredRefProp()?.outerHTML;
      const outer_8 = this.requiredForwardRefProp()?.outerHTML;
    },
    __getRestRefs() {
      const { outerDivRef, ...restProps } = this.props;
      return {
        refProp: restProps.refProp?.(),
        forwardRefProp: restProps.forwardRefProp?.(),
        requiredRefProp: restProps.requiredRefProp(),
        requiredForwardRefProp: restProps.requiredForwardRefProp(),
      };
    },
    forwardRef_forwardRef(ref) {
      if (arguments.length) {
        this.$refs.forwardRef = ref;
      }
      return this.$refs.forwardRef;
    },
    forwardRef_existingForwardRef(ref) {
      if (arguments.length) {
        this.$refs.existingForwardRef = ref;
      }
      return this.$refs.existingForwardRef;
    },
    forwardRef_outerDivRef(ref) {
      if (arguments.length) {
        this.$refs.outerDivRef = ref;
        this.outerDivRef?.(ref);
      }
      return this.$refs.outerDivRef;
    },
    forwardRef_forwardRefProp(ref) {
      if (arguments.length) {
        this.$refs.forwardRefProp = ref;
        this.forwardRefProp?.(ref);
      }
      return this.$refs.forwardRefProp;
    },
    forwardRef_requiredForwardRefProp(ref) {
      if (arguments.length) {
        this.$refs.requiredForwardRefProp = ref;
        this.requiredForwardRefProp?.(ref);
      }
      return this.$refs.requiredForwardRefProp;
    },
    __forwardRef() {
      this.outerDivRef?.(this.$refs.outerDivRef);
    },
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
