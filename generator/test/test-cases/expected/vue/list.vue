<template>
  <div>
      <div :key="item.key" v-for="item of items">{{item.text}}</div>
  </div>
</template>
<script>
export const ListInput = {
  items: {
    type: Array
  }
};

export default {
  props: ListInput,
  methods: {
    __restAttributes() {
      return {};
    }
  }
};
</script>
