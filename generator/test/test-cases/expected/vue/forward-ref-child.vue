<template>
  <div ref="childRef">
    <div ref="nullableRef"></div>
  </div>
</template>
<script>
const Props = {
  childRef: {
    type: Function,
    required: true
  },
  nullableRef: {
    type: Function
  }
};

export default {
  props: Props,
  methods: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        childRef: this.$refs.childRef,
        nullableRef: this.$refs.nullableRef
      };
    },
    __forwardRef() {
      this.childRef(this.$refs.childRef);
      this.nullableRef(this.$refs.nullableRef);
    }
  },
  mounted() {
    this.__forwardRef();
  },
  updated() {
    this.__forwardRef();
  }
};
</script>