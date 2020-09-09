<template>
  <div></div>
</template>
<script>
const WidgetInput = {};
export const DxWidget = {
  props: WidgetInput,
  data() {
    return {
      decoratedState: "",
      simpleState: "",
    };
  },
  computed: {
    __privateGetter() {
      return this.decoratedState.concat(this.simpleState);
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  methods: {
    __simpleGetter() {
      return this.decoratedState.concat(this.simpleState);
    },
  },
};
export default DxWidget;
</script>
