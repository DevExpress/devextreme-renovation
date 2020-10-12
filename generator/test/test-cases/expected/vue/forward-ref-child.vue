<template>
  <div ref="childRef"><div ref="nullableRef"></div></div>
</template>
<script>
const Props = {
  childRef: {
    type: Function,
    required: true,
  },
  nullableRef: {
    type: Function,
  },
  state: {
    type: Number,
  },
};
export const DxRefOnChildrenChild = {
  props: Props,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { state: this.state };
    },
  },
  methods: {
    __method() {
      const nullableRefHtml = this.$refs.nullableRef?.innerHTML;
      if (this.nullableRef) {
        this.forwardRef_nullableRef(this.$refs.childRef),
          this.nullableRef(this.$refs.childRef);
      }
      return nullableRefHtml;
    },
    forwardRef_childRef(ref) {
      this.$refs.childRef = ref;
    },
    forwardRef_nullableRef(ref) {
      this.$refs.nullableRef = ref;
    },
    __forwardRef() {
      this.childRef(this.$refs.childRef);
      this.nullableRef?.(this.$refs.nullableRef);
    },
  },
  mounted() {
    this.__forwardRef();
  },
  updated() {
    this.__forwardRef();
  },
};
export default DxRefOnChildrenChild;
</script>
