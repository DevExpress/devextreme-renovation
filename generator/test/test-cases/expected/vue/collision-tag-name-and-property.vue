<template>
  <text
    ><template v-if="![].length">{{ text }}</template></text
  >
</template>
<script>
export const TextSvgElementProps = {
  text: {
    type: [String],
    default() {
      return "";
    },
  },
};
export const DxTextSvgElement = {
  name: "TextSvgElement",
  props: TextSvgElementProps,
  computed: {
    __computedProps() {
      return this.props;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { text: this.text };
    },
  },
};
export default DxTextSvgElement;
</script>
