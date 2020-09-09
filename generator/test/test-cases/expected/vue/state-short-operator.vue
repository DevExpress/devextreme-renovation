<template>
  <div></div>
</template>
<script>
const WidgetInput = {
  propState: {
    type: Number,
    default() {
      return 1;
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  data() {
    return {
      innerState: 0,
      propState_state: this.propState,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        propState: this.propState_state,
        propStateChange: this.propStateChange,
      };
    },
  },
  watch: {
    propState: ["__propState_watcher"],
  },
  methods: {
    __updateState() {
      this.innerState = this.innerState + 1;
      this.innerState = this.innerState + 1;
      this.innerState = this.innerState + 1;
      this.innerState = this.innerState + 1;
      (this.propState_state = this.propState_state + 1),
        this.propStateChange(this.propState_state);
      (this.propState_state = this.propState_state + 1),
        this.propStateChange(this.propState_state);
      (this.propState_state = this.propState_state + 1),
        this.propStateChange(this.propState_state);
      (this.propState_state = this.propState_state + 1),
        this.propStateChange(this.propState_state);
    },
    propStateChange(...args) {
      this.$emit("update:prop-state", ...args);
    },
    __propState_watcher(s) {
      this.propState_state = s;
    },
  },
};
export default DxWidget;
</script>
