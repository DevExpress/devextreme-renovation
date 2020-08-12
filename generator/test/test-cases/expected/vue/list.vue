<template>
  <div>
    <div :key="item.key" v-for="item of items">{{ item.text }}</div>
  </div>
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
