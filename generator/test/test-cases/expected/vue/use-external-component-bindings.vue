<template>
  <div>{{ height }}</div>
</template>
<script>
import Props from "./component-bindings-only";

import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: Object.keys(Props).reduce(
    (props, propName) => ({
      ...props,
      [propName]: { ...Props[propName] },
    }),
    {}
  ),
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { height: this.height };
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
</script>
