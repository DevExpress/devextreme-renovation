<template>
  <div></div>
</template>
<script>
const WidgetProps = {
  someProp: {
    type: String,
    default() {
      return "";
    },
  },
  type: {
    type: String,
    default() {
      return "";
    },
  },
  currentDate: {
    type: [Date, Number, String],
    default() {
      return new Date();
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  data() {
    return {
      currentDate_state: this.currentDate,
    };
  },
  computed: {
    __internalInterfaceGetter() {
      return { field1: { a: this.someProp }, field2: 2, field3: 3 };
    },
    __internalTypeGetter() {
      return { a: "1" };
    },
    __externalInterfaceGetter() {
      return { inputInt: 2 };
    },
    __externalTypeGetter() {
      return { value: "" };
    },
    __someDate() {
      return new Date(this.currentDate_state);
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        someProp: this.someProp,
        type: this.type,
        currentDate: this.currentDate_state,
        currentDateChange: this.currentDateChange,
      };
    },
  },
  watch: {
    currentDate: ["__currentDate_watcher"],
  },
  methods: {
    currentDateChange(...args) {
      this.$emit("update:current-date", ...args);
    },
    __currentDate_watcher(s) {
      this.currentDate_state = s;
    },
  },
};
export default DxWidget;
</script>
