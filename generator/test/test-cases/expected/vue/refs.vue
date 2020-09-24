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
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        refProp: this.refProp?.(),
        requiredRefProp: this.requiredRefProp(),
      };
    },
  },
  methods: {
    __writeRefs() {
      let someRef;
      if (this.refProp?.()) {
        this.props.refProp = this.$refs.divRef;
      }
      this.refProp?.() && (this.props.refProp = this.$refs.divRef);
      someRef = this.props.refProp ? this.props.refProp : this.$refs.divRef;
      if (this.forwardRefProp) {
        this.forwardRef_forwardRefProp(this.$refs.divRef),
          this.forwardRefProp(this.$refs.divRef);
      }
      this.forwardRefProp &&
        (this.forwardRef_forwardRefProp(this.$refs.divRef),
        this.forwardRefProp(this.$refs.divRef));
      someRef = this.$refs.forwardRefProp
        ? this.$refs.forwardRefProp
        : this.$refs.divRef;
      if (this.$refs) {
        this.$refs.ref = this.$refs.divRef;
      }
      this.$refs && (this.$refs.ref = this.$refs.divRef);
      someRef = this.$refs.ref ? this.$refs.ref : this.$refs.divRef;
      if (this.$refs) {
        this.$refs.forwardRef = this.$refs.divRef;
      }
      this.$refs && (this.$refs.forwardRef = this.$refs.divRef);
      someRef = this.$refs.forwardRef
        ? this.$refs.forwardRef
        : this.$refs.divRef;
      this.$refs.existingRef = this.$refs.divRef;
      this.$refs.existingForwardRef = this.$refs.divRef;
      this.props.requiredRefProp = this.$refs.divRef;
      this.forwardRef_requiredForwardRefProp(this.$refs.divRef),
        this.requiredForwardRefProp(this.$refs.divRef);
    },
    __readRefs() {
      const outer_1 = this.props.refProp?.outerHTML;
      const outer_2 = this.$refs.forwardRefProp?.outerHTML;
      const outer_3 = this.$refs.ref?.outerHTML;
      const outer_4 = this.$refs.forwardRef?.outerHTML;
      const outer_5 = this.$refs.existingRef.outerHTML;
      const outer_6 = this.$refs.existingForwardRef.outerHTML;
      const outer_7 = this.props.requiredRefProp.outerHTML;
      const outer_8 = this.$refs.requiredForwardRefProp.outerHTML;
    },
    forwardRef_forwardRef(ref) {
      this.$refs.forwardRef = ref;
    },
    forwardRef_existingForwardRef(ref) {
      this.$refs.existingForwardRef = ref;
    },
    forwardRef_outerDivRef(ref) {
      this.$refs.outerDivRef = ref;
    },
    forwardRef_forwardRefProp(ref) {
      this.$refs.forwardRefProp = ref;
    },
    forwardRef_requiredForwardRefProp(ref) {
      this.$refs.requiredForwardRefProp = ref;
    },
    __forwardRef() {
      this.outerDivRef?.(this.$refs.outerDivRef);
      this.forwardRefProp?.(this.$refs.forwardRefProp);
      this.requiredForwardRefProp(this.$refs.requiredForwardRefProp);
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
