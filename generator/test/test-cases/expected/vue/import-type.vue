<template>
  <div>{{ Test === undefined || Test === null ? undefined : Test.value }}</div>
</template>
<script>
export const ImportProps = {
  Test: {
    type: Object,
  },
};
export const DxImport = {
  name: "Import",
  props: ImportProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { Test: this.Test };
    },
  },
};
export default DxImport;
</script>
