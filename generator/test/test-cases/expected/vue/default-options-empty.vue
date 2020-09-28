<script>
export const WidgetProps = {};
import { convertRulesToOptions } from "../../../../component_declaration/default_options";

const __defaultOptionRules = [{ device: true, options: {} }];
export function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
}

export const DxWidget = {
  props: Object.keys(WidgetProps).reduce(
    (props, propName) => ({
      ...props,
      [propName]: { ...WidgetProps[propName] },
    }),
    {}
  ),
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
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
