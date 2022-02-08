<template>
  <span
    >{{ (sizes ?? { width: 0, height: 0 }).height
    }}{{ (sizes ?? { width: 0, height: 0 }).width }}</span
  >
</template>
<script>
const device = "ios";
function isDevice() {
  return true;
}
export const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  export: {
    type: Object,
    default() {
      return {};
    },
  },
  array: {
    default() {
      return ["1"];
    },
  },
  currentDate: {
    default() {
      return new Date();
    },
  },
  expressionDefault: {
    type: String,
    default() {
      return device === "ios" ? "yes" : "no";
    },
  },
  expressionDefault1: {
    type: Boolean,
    default() {
      return !device;
    },
  },
  expressionDefault2: {
    type: [Boolean, String],
    default() {
      return isDevice() || "test";
    },
  },
  sizes: {
    type: Object,
  },
  stringValue: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  data() {
    return {
      stringValue_state: this.stringValue,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        export: this.export,
        array: this.array,
        currentDate: this.currentDate,
        expressionDefault: this.expressionDefault,
        expressionDefault1: this.expressionDefault1,
        expressionDefault2: this.expressionDefault2,
        sizes: this.sizes,
        stringValue: this.stringValue_state,
        onClick: this.onClick,
        onSomething: this.onSomething,
        stringValueChange: this.stringValueChange,
      };
    },
  },
  watch: {
    stringValue: ["__stringValue_watcher"],
  },
  methods: {
    __getHeight() {
      this.onClick(10);
      this.onClick(11);
      return this.height;
    },
    __getRestProps() {
      const { height, onClick, ...rest } = this.props;
      return rest;
    },
    onClick(...args) {
      this.$emit("click", ...args);
    },
    onSomething(...args) {
      this.$emit("something", ...args);
    },
    stringValueChange(...args) {
      this.$emit("update:string-value", ...args);
    },
    __stringValue_watcher(s) {
      this.stringValue_state = s;
    },
  },
};
export default DxWidget;
</script>
