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
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  methods: {
    __updateState() {
      this._hovered = !this._hovered;
    },
  },
};
</script>
