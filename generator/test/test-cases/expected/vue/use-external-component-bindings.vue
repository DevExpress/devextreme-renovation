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
    const twoWayProps = [];
    return Object.keys(Props).reduce((props, propName) => {
      const prop = { ...Props[propName] };

      const twoWayPropName =
        propName.indexOf("default") === 0 &&
        twoWayProps.find(
          (p) => "default" + p.charAt(0).toUpperCase() + p.slice(1) === propName
        );
      const defaultPropName = twoWayPropName ? twoWayPropName : propName;

      if (typeof prop.default === "function") {
        const defaultValue = prop.default;
        prop.default = function () {
          return this._defaultOptions[defaultPropName] !== undefined
            ? this._defaultOptions[defaultPropName]
            : defaultValue();
        };
      } else if (!twoWayProps.some((p) => p === propName)) {
        const defaultValue = prop.default;
        prop.default = function () {
          return this._defaultOptions[defaultPropName] !== undefined
            ? this._defaultOptions[defaultPropName]
            : defaultValue;
        };
      }

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
