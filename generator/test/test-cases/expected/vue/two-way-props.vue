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
    default: undefined,
  },
  defaultSelected: {
    type: Boolean,
    default() {
      return false;
    },
  },
};

export default {
  props: WidgetInput,
  data() {
    return {
      selected_state: this.defaultSelected,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        selected:
          this.selected !== undefined ? this.selected : this.selected_state,
        selectedChange: this.selectedChange,
      };
    },
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
  },
};
</script>
