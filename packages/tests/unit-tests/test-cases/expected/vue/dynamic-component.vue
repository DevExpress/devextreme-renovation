<template>
  <div
    ><component
      v-bind:is="__JSXTemplateComponent"
      :height="internalStateValue"
      v-bind="{
        ...__spreadProps,
        ...{
          onClick: undefined,
          onSomething: undefined,
          stringValueChange: undefined,
        },
      }"
      @click="
        __spreadProps.onClick !== undefined
          ? __spreadProps.onClick
          : __onComponentClick
      "
      @something="__spreadProps.onSomething"
      @update:string-value="__spreadProps.stringValueChange"
    /><component
      v-bind:is="__Component"
      :height="height"
      @click="__onComponentClick"
    /><component v-bind:is="__ComponentWithTemplate"
      ><template v-slot:template="{ textProp }"
        ><div v-bind:style="__processStyle({ height: '50px' })">{{
          textProp
        }}</div></template
      ></component
    ></div
  >
</template>
<script>
import DynamicComponent, { WidgetInput } from "./props";
import DynamicComponentWithTemplate, {
  WidgetInput as PropsWithTemplate,
} from "./template";
const Props = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
};
import { normalizeStyles } from "@devextreme/runtime/common";

export const DxDynamicComponentCreator = {
  name: "DynamicComponentCreator",
  components: {
    DynamicComponent,
    DynamicComponentWithTemplate,
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
    __ComponentWithTemplate() {
      return DynamicComponentWithTemplate;
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
    __processStyle(value) {
      return normalizeStyles(value);
    },
  },
};
export default DxDynamicComponentCreator;
</script>
