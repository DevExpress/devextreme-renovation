<script>
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
import { convertRulesToOptions } from "../../../../declaration/src/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export const DxWidget = {
  name: "Widget",
  props: Object.keys(WidgetProps).reduce(
    (props, propName) => ({
      ...props,
      [propName]: { ...WidgetProps[propName] },
    }),
    {}
  ),
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
