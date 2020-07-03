<template>
  <span></span>
</template>
<script>
export default {
  data() {
    return {
      _hovered: false,
    };
  },
  methods: {
    __updateState() {
      this._hovered = !this._hovered;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
};
</script>
