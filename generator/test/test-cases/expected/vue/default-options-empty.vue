 <script>
import "typescript";
function view() {}
export const WidgetProps = {};

import { convertRulesToOptions } from "../../../../../component_declaration/default_options";

const __defaultOptionRules = [{ device: true, options: {} }];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: (() => {
    const twoWayProps = [];
    return Object.keys(WidgetProps).reduce((props, propName) => {
      const prop = { ...WidgetProps[propName] };
      if (typeof prop.default === "function") {
        const defaultValue = prop.default;
        const twoWayPropName =
          propName.indexOf("default") === 0 &&
          twoWayProps.find(
            p => "default" + p.charAt(0).toUpperCase() + p.slice(1) === propName
          );
        const defaultPropName = twoWayPropName ? twoWayProp : propName;

        prop.default = function() {
          return this._defaultOptions[propName] !== undefined
            ? this._defaultOptions[defaultPropName]
            : defaultValue();
        };
      }

      props[propName] = prop;
      return props;
    }, {});
  })(),
  methods: {
    __restAttributes() {
      return {};
    }
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  }
};
</script>
        