<template>
  <div
    ><template v-for="item of items"
      ><div :key="item.key">{{ item.text }}</div></template
    ></div
  >
</template>
<script>
export const ListInput = {
  items: {
    type: Array,
  },
};
export const DxList = {
  props: ListInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { items: this.items };
    },
  },
};
export default DxList;
</script>
