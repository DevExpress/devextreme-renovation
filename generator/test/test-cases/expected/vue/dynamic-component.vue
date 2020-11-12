<template>
  <div
    ><component
      v-bind:is="__JSXTemplateComponent"
      :height="internalStateValue"
      v-bind="{
        ...__spreadProps,
        ...{ onClick: undefined, onSomething: undefined },
      }"
      @click="
        __spreadProps.onClick !== undefined
          ? __spreadProps.onClick
          : __onComponentClick
      "
      @something="__spreadProps.onSomething" /><component
      v-bind:is="__Component"
      :height="height"
      @click="__onComponentClick"
  /></div>
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
  data() {
    return {
      internalStateValue: 0,
    };
  },
  computed: {
    __Component() {
      return DynamicComponent;
    },
    __JSXTemplateComponent() {
      return DynamicComponent;
    },
    __spreadProps() {
      return { export: {} };
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
