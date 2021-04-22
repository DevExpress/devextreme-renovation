<template>
  <div></div>
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
  oneWayProp: {
    type: Number,
  },
  twoWayProp: {
    type: Number,
  },
  someRef: {
    type: Function,
  },
  someForwardRef: {
    type: Function,
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

export const DxUndefWidget = {
  name: "UndefWidget",
  props: WidgetProps,
  data() {
    return {
      twoWayProp_state: this.twoWayProp,
    };
  },
  computed: {
    __oneway() {
      return (
        this.props.oneWayProp !== undefined ||
        this.$options.propsData.hasOwnProperty("oneWayProp")
      );
    },
    __twoway() {
      return (
        this.props.twoWayProp !== undefined ||
        this.$options.propsData.hasOwnProperty("twoWayProp")
      );
    },
    __someevent() {
      return (
        this.props.someEvent !== undefined ||
        this.$options.propsData.hasOwnProperty("someEvent")
      );
    },
    __someref() {
      return (
        this.props.someRef !== undefined ||
        this.$options.propsData.hasOwnProperty("someRef")
      );
    },
    __someforwardref() {
      return (
        this.props.someForwardRef !== undefined ||
        this.$options.propsData.hasOwnProperty("someForwardRef")
      );
    },
    __someslot() {
      return (
        this.props.slotProp !== undefined ||
        this.$options.propsData.hasOwnProperty("slotProp")
      );
    },
    __sometemplate() {
      return (
        this.props.templateProp !== undefined ||
        this.$options.propsData.hasOwnProperty("templateProp")
      );
    },
    __nested() {
      return (
        this.props.nestedProp !== undefined ||
        this.$options.propsData.hasOwnProperty("nestedProp")
      );
    },
    __nestedinit() {
      return (
        this.props.anotherNestedPropInit !== undefined ||
        this.$options.propsData.hasOwnProperty("anotherNestedPropInit")
      );
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        oneWayProp: this.oneWayProp,
        twoWayProp: this.twoWayProp_state,
        someEvent: this.someEvent,
        someRef: this.someRef,
        someForwardRef: this.someForwardRef?.(),
        slotProp: this.$slots.slotProp,
        templateProp: this.$scopedSlots.templateProp,
        nestedProp: this.__getNestedNestedProp,
        anotherNestedPropInit: this.__getNestedAnotherNestedPropInit,
        twoWayPropChange: this.twoWayPropChange,
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
  watch: {
    twoWayProp: ["__twoWayProp_watcher"],
  },
  methods: {
    forwardRef_someForwardRef(ref) {
      if (arguments.length) {
        this.$refs.someForwardRef = ref;
        this.someForwardRef?.(ref);
      }
      return this.$refs.someForwardRef;
    },
    someEvent(...args) {
      this.$emit("some-event", ...args);
    },
    twoWayPropChange(...args) {
      this.$emit("update:two-way-prop", ...args);
    },
    __forwardRef() {},
    __twoWayProp_watcher(s) {
      this.twoWayProp_state = s;
    },
  },
  mounted() {
    this.__forwardRef();
  },
  updated() {
    this.__forwardRef();
  },
};
export default DxUndefWidget;
</script>
