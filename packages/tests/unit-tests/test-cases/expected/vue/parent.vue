<template>
  <div
    >Parent<slot :name="childTemplate">
      <div style="display: contents" :set="(childTemplateDefault = {})"
        ><ChildDefault
      /></div> </slot
  ></div>
</template>
<script>
import { BetweenProps } from "./between_props";
const ChildDefault = BetweenProps.childTemplate.defaultTemplate();

export const DxParent = {
  name: "Parent",
  components: {
    ChildDefault,
  },
  props: BetweenProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { childTemplate: this.childTemplate };
    },
  },
};
export default DxParent;
</script>
