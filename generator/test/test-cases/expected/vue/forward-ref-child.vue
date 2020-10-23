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
      const nullableRefHtml = this.nullableRef?.()?.innerHTML;
      if (this.nullableRef) {
        this.forwardRef_nullableRef(this.childRef()),
          this.nullableRef(this.childRef());
      }
      return nullableRefHtml;
    },
    forwardRef_childRef(ref) {
      if (arguments.length) {
        this.$refs.childRef = ref;
        this.childRef?.(ref);
      }
      return this.$refs.childRef;
    },
    forwardRef_nullableRef(ref) {
      if (arguments.length) {
        this.$refs.nullableRef = ref;
        this.nullableRef?.(ref);
      }
      return this.$refs.nullableRef;
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
