<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  id: {
    type: String,
  },
  export: {
    type: Object,
  },
};
export const DxComponentWithRest = {
  name: "ComponentWithRest",
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { id: this.id, export: this.export };
    },
  },
};
export default DxComponentWithRest;
</script>
