<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  prop: {
    type: Boolean,
  },
};
export default {
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { prop: this.prop };
    },
  },
};
</script>
