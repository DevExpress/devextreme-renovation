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
export const TextsProps = {
  text: {
    type: String,
    default() {
      return format("text");
    },
  },
};
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
  __defaultNestedValues: {
    default() {
      return {
        baseNested: {
          text:
            TextsProps === undefined || TextsProps === null
              ? undefined
              : TextsProps.text?.default(),
        },
      };
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
  texts1: {
    type: Object,
    default() {
      return { text: format("text") };
    },
  },
  someTemplate: {
    type: String,
    default() {
      return "someTemplate";
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        texts2: { text: format("text") },
        texts3: {
          text:
            TextsProps === undefined || TextsProps === null
              ? undefined
              : TextsProps.text?.default(),
        },
        baseNested:
          BaseProps === undefined || BaseProps === null
            ? undefined
            : BaseProps.__defaultNestedValues?.default().baseNested,
      };
    },
  },
};
export const PickedProps = {
  someValue: {
    type: String,
    default() {
      return format("text");
    },
  },
};
export const WidgetTypeProps = {
  text: {
    type: String,
    default() {
      return typeof WidgetProps.text.default === "function"
        ? WidgetProps.text.default()
        : WidgetProps.text.default;
    },
  },
  texts1: {
    type: Object,
    default() {
      return typeof WidgetProps.texts1.default === "function"
        ? WidgetProps.texts1.default()
        : WidgetProps.texts1.default;
    },
  },
  someTemplate: {
    type: String,
    default() {
      return "someTemplate";
    },
  },
  empty: {
    type: String,
  },
  height: {
    type: Number,
    default() {
      return typeof WidgetProps.height.default === "function"
        ? WidgetProps.height.default()
        : WidgetProps.height.default;
    },
  },
  width: {
    type: Number,
    default() {
      return typeof WidgetProps.width.default === "function"
        ? WidgetProps.width.default()
        : WidgetProps.width.default;
    },
  },
  someValue: {
    type: String,
    default() {
      return typeof PickedProps.someValue.default === "function"
        ? PickedProps.someValue.default()
        : PickedProps.someValue.default;
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        texts2:
          typeof WidgetProps.texts2.default === "function"
            ? WidgetProps.texts2.default()
            : WidgetProps.texts2.default,
        texts3:
          typeof WidgetProps.texts3.default === "function"
            ? WidgetProps.texts3.default()
            : WidgetProps.texts3.default,
        baseNested:
          typeof WidgetProps.baseNested.default === "function"
            ? WidgetProps.baseNested.default()
            : WidgetProps.baseNested.default,
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
export const DxTexts2 = {
  props: TextsProps,
};
DxTexts2.propName = "texts2";
DxTexts2.defaultProps = __extractDefaultValues(TextsProps);

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
        texts1: this.texts1,
        texts2: this.__getNestedTexts2,
        texts3: this.__getNestedTexts3,
        someTemplate: this.someTemplate,
        empty: this.empty,
        height: this.height,
        width: this.width,
        baseNested: this.__getNestedBaseNested,
      };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
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
    __getNestedTexts3() {
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "texts3")
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
      return this.texts3
        ? this.texts3
        : nested.length
        ? nested?.[0]
        : this?.__defaultNestedValues?.texts3;
    },
    __getNestedBaseNested() {
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "baseNested")
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
      return this.baseNested
        ? this.baseNested
        : nested.length
        ? nested?.[0]
        : this?.__defaultNestedValues?.baseNested;
    },
  },
};
export default DxWidget;
</script>
