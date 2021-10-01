<template>
  <div>Child</div>
</template>
<script>
export const ChildProps = {
  number: {
    type: Number,
    default() {
      return 3;
    },
  },
};
export const DxChild = {
  name: "Child",
  props: ChildProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { number: this.number };
    },
  },
};
export default DxChild;
</script>
