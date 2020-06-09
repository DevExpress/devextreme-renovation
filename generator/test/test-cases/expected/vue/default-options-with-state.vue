 <script>
function view() {}
export const WidgetProps = {
  p1: {
    type: String,
    default: undefined
  },
  p2: {
    type: String,
    default: undefined
  },
  defaultP1: {
    type: String,
    default() {
      return "";
    }
  },
  defaultP2: {
    type: String,
    default() {
      return "";
    }
  }
};

import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: (() => {
    const twoWayProps = ["p1", "p2"];
    return Object.keys(WidgetProps).reduce((props, propName) => {
      const prop = { ...WidgetProps[propName] };

      const twoWayPropName =
        propName.indexOf("default") === 0 &&
        twoWayProps.find(
          p => "default" + p.charAt(0).toUpperCase() + p.slice(1) === propName
        );
      const defaultPropName = twoWayPropName ? twoWayPropName : propName;

      if (typeof prop.default === "function") {
        const defaultValue = prop.default;
        prop.default = function() {
          return this._defaultOptions[defaultPropName] !== undefined
            ? this._defaultOptions[defaultPropName]
            : defaultValue();
        };
      } else if (!twoWayProps.some(p => p === propName)) {
        const defaultValue = prop.default;
        prop.default = function() {
          return this._defaultOptions[defaultPropName] !== undefined
            ? this._defaultOptions[defaultPropName]
            : defaultValue;
        };
      }

      props[propName] = prop;
      return props;
    }, {});
  })(),
  data() {
    return {
      p1_state: this.defaultP1,
      p2_state: this.defaultP2
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    props(){
      return {
        p1:(this.p1 !== undefined ? this.p1 : this.p1_state),
        p2:(this.p2 !== undefined ? this.p2 : this.p2_state),
        p1Change:this.p1Change,
        p2Change:this.p2Change
      };
    },
    p1Change(...args) {
      this.$emit("update:p1", ...args);
    },
    p2Change(...args) {
      this.$emit("update:p2", ...args);
    }
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  }
};
</script>
