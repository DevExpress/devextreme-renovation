<template>
  <div></div>
</template>
<script>
export const NestedProps = {
  oneWay: {
    type: Boolean,
    default() {
      return false;
    },
  },
  twoWay: {
    type: Boolean,
    default() {
      return false;
    },
  },
};
export const WidgetProps = {};
import { convertRulesToOptions } from "../../../../jquery-helpers/default_options";

function __collectChildren(children) {
  return children.reduce((acc, child) => {
    const name = child.componentOptions?.Ctor?.extendOptions?.propName;
    const tag = child.tag || "";
    const isUnregisteredDxTag = tag.indexOf("Dx") === 0;
    if (name) {
      const collectedChildren = {};
      const defaultProps =
        child.componentOptions?.Ctor?.extendOptions?.defaultProps || {};
      const childProps = Object.assign(
        {},
        defaultProps,
        child.componentOptions.propsData
      );
      if (child.componentOptions.children) {
        __collectChildren(child.componentOptions.children).forEach(
          ({ __name, ...cProps }) => {
            if (__name) {
              if (!collectedChildren[__name]) {
                collectedChildren[__name] = [];
              }
              collectedChildren[__name].push(cProps);
            }
          }
        );
      }

      acc.push({
        ...collectedChildren,
        ...childProps,
        __name: name,
      });
    } else if (isUnregisteredDxTag) {
      throw new Error(
        `Unknown custom element: <${tag}> - did you register the component correctly?'`
      );
    }
    return acc;
  }, []);
}
function __extractDefaultValues(propsObject) {
  return Object.entries(propsObject)
    .filter(([key, value]) => value?.default)
    .reduce((accObj, [key, value]) => {
      accObj[key] = value.default();
      return accObj;
    }, {});
}
export const DxNested = {
  props: NestedProps,
};
DxNested.propName = "nested";
DxNested.defaultProps = __extractDefaultValues(NestedProps);

const __defaultOptionRules = [
  { device: true, options: { nested: { oneWay: true } } },
];
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
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { nested: this.__getNestedNested };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
    },
    __getNestedNested() {
      const nested = this.__nestedChildren.filter(
        (child) => child.__name === "nested"
      );
      return this.nested
        ? this.nested
        : nested.length
        ? nested?.[0]
        : undefined;
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
