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
  methods: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        prop: this.prop,
      };
    },
  },
};
</script>
