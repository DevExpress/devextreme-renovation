<script>
function view() {}
export const WidgetProps = {
  p1: {
    type: String,
    default() {
      return "";
    },
  },
  p2: {
    type: String,
    default() {
      return "";
    },
  },
};

import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: (() => {
    return Object.keys(WidgetProps).reduce((props, propName) => {
      const prop = { ...WidgetProps[propName] };
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
  data() {
    return {
      p1_state: this.p1,
      p2_state: this.p2,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        p1: this.p1_state,
        p2: this.p2_state,
        p1Change: this.p1Change,
        p2Change: this.p2Change,
      };
    },
  },
  watch: {
    p1: ["__p1_watcher"],
    p2: ["__p2_watcher"],
  },
  methods: {
    p1Change(...args) {
      this.$emit("update:p1", ...args);
    },
    p2Change(...args) {
      this.$emit("update:p2", ...args);
    },
    __p1_watcher(s) {
      this.p1_state = s;
    },
    __p2_watcher(s) {
      this.p2_state = s;
    },
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  },
};
</script>
