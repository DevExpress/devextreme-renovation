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
    clickHandler(){
      const html=this.$refs.divRef.outerHTML+this.$refs.explicitRef.outerHTML;
    },
    __getHeight() {
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
        