<template>
  <text
    ><template v-if="![].length">{{ text }}</template></text
  >
</template>
<script>
import SvgGraphicsProps from "./base_graphics_props";
export const TextSvgElementProps = {
  ...SvgGraphicsProps,
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
