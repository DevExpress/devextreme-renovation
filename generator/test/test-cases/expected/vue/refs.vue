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
    required: true,
  },
  forwardRefProp: {
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
        outerDivRef: this.$refs.outerDivRef,
        refProp: this.refProp(),
        forwardRefProp: this.$refs.forwardRefProp,
      };
    },
  },
  methods: {
    __writeRefs() {
      this.props.refProp = this.$refs.divRef;
      this.forwardRef_forwardRefProp(this.$refs.divRef);
      this.forwardRefProp(this.$refs.divRef);
      this.$refs.ref = this.$refs.divRef;
      this.$refs.forwardRef = this.$refs.divRef;
    },
    __readRefs() {
      const outer_1 = this.props.refProp.outerHTML;
      const outer_2 = this.$refs.forwardRefProp.outerHTML;
      const outer_3 = this.$refs.ref.outerHTML;
      const outer_4 = this.$refs.forwardRef.outerHTML;
    },
    forwardRef_forwardRef(ref) {
      this.$refs.forwardRef = ref;
    },
    forwardRef_outerDivRef(ref) {
      this.$refs.outerDivRef = ref;
    },
    forwardRef_forwardRefProp(ref) {
      this.$refs.forwardRefProp = ref;
    },
    __forwardRef() {
      this.outerDivRef(this.$refs.outerDivRef);
      this.forwardRefProp(this.$refs.forwardRefProp);
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
