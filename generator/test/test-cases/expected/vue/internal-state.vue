<template>
  <span ></span>
</template>
<script>

export default {
  data(){
      return {
        _hovered: false
      };
  },
  methods: {
    updateState(){
        this._hovered=!this._hovered;
    },
    __restAttributes() {
      return {};
    },
    props(){
      return {};
    },
  }
};
</script>
