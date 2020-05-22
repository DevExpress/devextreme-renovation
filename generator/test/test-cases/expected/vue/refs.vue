<template>
  <div ref="divRef">
    <div ref="explicitRef">
      <div ref="nullableRef"></div>
    </div>
  </div>
</template>
 <script>
export default {
  methods: {
    getHeight() {
      return this.$refs.divRef.outerHTML+this.$refs.nullableRef?.outerHTML;
    },
    __restAttributes() {
      return {};
    },
    props(){
      return {};
    }
  }
};
</script>
        