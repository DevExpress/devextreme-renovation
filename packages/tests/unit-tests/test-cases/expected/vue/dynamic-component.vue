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
const NUMBER_STYLES = new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
]);
const uppercasePattern = /[A-Z]/g;
const kebabCase = (str) => {
  return str.replace(uppercasePattern, "-$&").toLowerCase();
};

const isNumeric = (value) => {
  if (typeof value === "number") return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style, value) => {
  return NUMBER_STYLES.has(style) ? value : `${value}px`;
};

const normalizeStyles = (styles) => {
  if (!(styles instanceof Object)) return undefined;

  return Object.entries(styles).reduce((result, [key, value]) => {
    const kebabString = kebabCase(key);
    result[kebabString] = isNumeric(value)
      ? getNumberStyleValue(kebabString, value)
      : value;
    return result;
  }, {});
};

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
