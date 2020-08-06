<script>
import "typescript";
function view() {}
export const WidgetProps = {};

import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [{ device: true, options: {} }];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: (() => {
    return Object.keys(WidgetProps).reduce((props, propName) => {
      const prop = { ...WidgetProps[propName] };

      if (prop.type !== Function) {
        const defaultValue = prop.default;
        prop.default = function () {
          return this._defaultOptions[propName] !== undefined
            ? this._defaultOptions[propName]
            : typeof defaultValue === "function"
            ? defaultValue()
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
      return {};
    },
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  },
};
</script>
