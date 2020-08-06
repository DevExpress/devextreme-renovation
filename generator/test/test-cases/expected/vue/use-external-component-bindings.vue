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
  props: (() => {
    return Object.keys(Props).reduce((props, propName) => {
      const prop = { ...Props[propName] };
      const defaultValue = prop.default;

      prop.default = function () {
        return this._defaultOptions[propName] !== undefined
          ? this._defaultOptions[propName]
          : typeof defaultValue === "function"
          ? defaultValue()
          : defaultValue;
      };

      props[propName] = prop;
      return props;
    }, {});
  })(),
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { height: this.height };
    },
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  },
};
</script>
