<template>
  <div></div>
</template>
<script>
function isMaterial() {
  return true;
}
function format(key) {
  return "localized_" + key;
}
export const BaseProps = {
  empty: {
    type: String,
  },
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  width: {
    type: Number,
    default() {
      return isMaterial() ? 20 : 10;
    },
  },
};
export const TextsProps = {
  text: {
    type: String,
    default() {
      return format("text");
    },
  },
};
export const WidgetProps = {
  ...BaseProps,
  text: {
    type: String,
    default() {
      return format("text");
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        texts1: { text: format("text") },
        texts2: {
          text:
            TextsProps === undefined || TextsProps === null
              ? undefined
              : TextsProps.text?.default(),
        },
      };
    },
  },
};
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
export const DxTexts1 = {
  props: TextsProps,
};
DxTexts1.propName = "texts1";
DxTexts1.defaultProps = __extractDefaultValues(TextsProps);

export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        text: this.text,
        texts1: this.__getNestedTexts1,
        texts2: this.__getNestedTexts2,
        empty: this.empty,
        height: this.height,
        width: this.width,
      };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
    },
    __getNestedTexts1() {
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "texts1")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return n?.__defaultNestedValues || n;
          }
          return n;
        });
      return this.texts1
        ? this.texts1
        : nested.length
        ? nested?.[0]
        : this?.__defaultNestedValues?.texts1;
    },
    __getNestedTexts2() {
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "texts2")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return n?.__defaultNestedValues || n;
          }
          return n;
        });
      return this.texts2
        ? this.texts2
        : nested.length
        ? nested?.[0]
        : this?.__defaultNestedValues?.texts2;
    },
  },
};
export default DxWidget;
</script>
