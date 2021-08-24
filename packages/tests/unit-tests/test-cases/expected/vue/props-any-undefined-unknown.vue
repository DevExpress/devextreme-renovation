<template>
  <div></div>
</template>
<script>
export const WidgetInput = {
  anyProp: {},
  undefinedProp: {},
  unknownProp: {},
};
import { convertRulesToOptions } from "../../../../jquery-helpers/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export const DxWidget = {
  name: "Widget",
  props: Object.keys(WidgetInput).reduce(
    (props, propName) => ({
      ...props,
      [propName]: { ...WidgetInput[propName] },
    }),
    {}
  ),
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        anyProp: this.anyProp,
        undefinedProp: this.undefinedProp,
        unknownProp: this.unknownProp,
      };
    },
  },
  beforeCreate() {
    const defaultOptions = convertRulesToOptions(__defaultOptionRules);
    Object.keys(this.$options.props).forEach((propName) => {
      const defaultValue = defaultOptions[propName];
      const prop = this.$options.props[propName];
      if (defaultValue !== undefined) {
        prop.default =
          prop.type !== Function ? () => defaultValue : defaultValue;
      }
    });
  },
};
export default DxWidget;
</script>
