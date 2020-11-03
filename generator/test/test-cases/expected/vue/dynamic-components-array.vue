<template>
  <div
    ><template v-for="(C, index) of __Components"
      ><component
        v-bind:is="C"
        :key="index"
        @click="__onComponentClick" /></template
  ></div>
</template>
<script>
import DynamicComponent, { WidgetInput } from "./props";
const Props = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxDynamicComponentCreator = {
  components: {
    DynamicComponent,
  },
  props: Props,
  computed: {
    __Components() {
      return [DynamicComponent];
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { height: this.height };
    },
  },
  methods: {
    __onComponentClick() {},
  },
};
export default DxDynamicComponentCreator;
</script>
