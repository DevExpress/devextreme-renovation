<template>
  <div></div>
</template>
<script>
export const WidgetProps = {
  element: {
    type: Element,
  },
  htmlElement: {
    type: HTMLElement,
  },
  divElement: {
    type: HTMLDivElement,
  },
  svgElement: {
    type: SVGElement,
  },
};
export const DxWidget = {
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        element: this.element,
        htmlElement: this.htmlElement,
        divElement: this.divElement,
        svgElement: this.svgElement,
      };
    },
  },
};
export default DxWidget;
</script>
