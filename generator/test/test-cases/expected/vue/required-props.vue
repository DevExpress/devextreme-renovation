<script>
function view() {}
const WidgetInput = {
  size: {
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
};
import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export default {
  props: (() => {
    return Object.keys(WidgetInput).reduce((props, propName) => {
      const prop = { ...WidgetInput[propName] };

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
    __getHeight() {
      return this.size.height;
    },
    __type() {
      const { type } = this.props;
      return type;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { size: this.size, type: this.type };
    },
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(__defaultOptionRules);
  },
};
</script>
