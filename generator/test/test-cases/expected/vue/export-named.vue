<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  prop: {
    type: Boolean,
  },
};
export const Widget = {
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

export default Widget;
</script>
