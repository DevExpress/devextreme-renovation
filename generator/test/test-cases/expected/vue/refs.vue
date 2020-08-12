<template>
  <div ref="divRef">
    <div ref="explicitRef">
      <div ref="nullableRef"></div>
    </div>
  </div>
</template>
<script>
export const DxWidget = {
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  methods: {
    __clickHandler() {
      const html =
        this.$refs.divRef.outerHTML + this.$refs.explicitRef.outerHTML;
    },
    __getHeight() {
      return this.$refs.divRef.outerHTML + this.$refs.nullableRef?.outerHTML;
    },
  },
};
export default DxWidget;
</script>
