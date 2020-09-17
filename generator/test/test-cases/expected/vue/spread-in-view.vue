<template>
  <div v-bind="__rest()"></div>
</template>
<script>
export const WidgetProps = {
  a: {
    type: Array,
    default() {
      return [1, 2, 3];
    },
  },
  id: {
    type: String,
    default() {
      return "1";
    },
  },
};
export const DxWidget = {
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { a: this.a, id: this.id };
    },
  },
  methods: {
    __rest() {
      const { a, ...rest } = this.props;
      return { ...rest };
    },
  },
};
export default DxWidget;
</script>
