<template>
  <Widget :prop="true" />
</template>
<script>
import { DxWidget as Widget } from "./export-named";
const ChildInput = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxChild = {
  components: {
    Widget,
  },
  props: ChildInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { height: this.height };
    },
  },
};
export default DxChild;
</script>
