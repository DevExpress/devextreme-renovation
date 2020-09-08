<template>
  <span></span>
</template>
<script>
const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  selected: {
    type: Boolean,
    default() {
      return false;
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  data() {
    return {
      selected_state: this.selected,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        selected: this.selected_state,
        selectedChange: this.selectedChange,
      };
    },
  },
  watch: {
    selected: ["__selected_watcher"],
  },
  methods: {
    __getHeight() {
      const { height } = this.props;
      const { height: _height } = this.props;
      return height + _height;
    },
    __getProps() {
      return this.props;
    },
    selectedChange(...args) {
      this.$emit("update:selected", ...args);
    },
    __selected_watcher(s) {
      this.selected_state = s;
    },
  },
};
export default DxWidget;
</script>
