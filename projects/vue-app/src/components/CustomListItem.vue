<template>
  <div>
    <div class="product">
      <img :src="`https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/${item.ImageSrc}`">
      <div>{{ item.Name }}</div>
      <div class="price">${{ item.Price }}</div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
};
</script>
<style scoped>
.product {
    height: 65px;
}

.product > img {
    height: 100%;
    width: 95px;
    float: left;
}

.product > div {
    padding-left: 10px;
    vertical-align: top;
    line-height: 65px;
    font-size: 15px;
    float: left;
}

.product > div.price {
    float: right;
    font-size: 18px;
}
</style>
