<script>
const WidgetInput = {
  size: {
    type: Object,
    required: true,
  },
  typeProp: {
    type: String,
    required: true,
  },
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
    __getHeight() {
      return this.size.height;
    },
    __type() {
      const { typeProp } = this.props;
      return typeProp;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { size: this.size, typeProp: this.typeProp };
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
