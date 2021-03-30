<template>
  <div v-bind:class="global_CLASS_NAME"
    ><span v-bind:class="global_CLASS_NAME"></span
    ><ExternalComponent /><template v-for="item of items"
      ><div :key="global_getKey(item)"></div></template
  ></div>
</template>
<script>
import { COMPONENT_INPUT_CLASS } from "./component-input";
import { DxWidgetTwo as ExternalComponent } from "./component-pass-two";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
const getKey = (item) => item.key;
export const WidgetProps = {
  items: {
    type: Array,
    default() {
      return [];
    },
  },
};
export const DxWidgetWithGlobals = {
  name: "WidgetWithGlobals",
  components: {
    ExternalComponent,
  },
  props: WidgetProps,
  data() {
    return {
      global_CLASS_NAME: CLASS_NAME,
      global_getKey: getKey,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { items: this.items };
    },
  },
};
export default DxWidgetWithGlobals;
</script>
