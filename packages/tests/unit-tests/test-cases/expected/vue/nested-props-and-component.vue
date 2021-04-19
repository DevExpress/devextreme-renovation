<template>
  <div>
    <div>Nested:{{ __nested }}</div>
  </div>
</template>
<script>
export const FakeNested = {
  numberProp: {
    type: Number,
    default() {
      return 2;
    },
  },
};
export const WidgetProps = {
  someProp: {
    type: Number,
  },
  nestedProp: {
    type: Array,
  },
  anotherNestedPropInit: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return {
        anotherNestedPropInit: [
          {
            numberProp:
              FakeNested === undefined || FakeNested === null
                ? undefined
                : FakeNested.numberProp?.default(),
          },
        ],
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
export const DxNestedProp = {
  props: FakeNested,
};
DxNestedProp.propName = "nestedProp";
DxNestedProp.defaultProps = __extractDefaultValues(FakeNested);

export const DxundefWidget = {
  name: "undefWidget",
  props: WidgetProps,
  computed: {
    __someprop() {
      return this.props.hasOwnProperty("someProp");
    },
    __nested() {
      return this.props.hasOwnProperty("nestedProp");
    },
    __nestedinit() {
      return this.props.hasOwnProperty("anotherNestedPropInit");
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        someProp: this.someProp,
        slotProp: this.$slots.slotProp,
        templateProp: this.$scopedSlots.templateProp,
        nestedProp: this.__getNestedNestedProp,
        anotherNestedPropInit: this.__getNestedAnotherNestedPropInit,
      };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
    },
    __getNestedNestedProp() {
      const nested = this.__nestedChildren.filter(
        (child) => child.__name === "nestedProp"
      );
      return this.nestedProp
        ? this.nestedProp
        : nested.length
        ? nested
        : undefined;
    },
    __getNestedAnotherNestedPropInit() {
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "anotherNestedPropInit")
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
      return this.anotherNestedPropInit
        ? this.anotherNestedPropInit
        : nested.length
        ? nested
        : this?.__defaultNestedValues?.anotherNestedPropInit;
    },
  },
};
export default DxundefWidget;
</script>
