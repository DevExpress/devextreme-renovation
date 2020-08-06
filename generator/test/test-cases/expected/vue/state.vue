<template>
  <div>
    {{ state1_state
    }}<BaseState @update:base-state-prop="__stateChange"></BaseState>
  </div>
</template>
<script>
import BaseState from "./model";
const WidgetInput = {
  state1: {
    type: Boolean,
    default() {
      return false;
    },
  },
  state2: {
    type: Boolean,
    default() {
      return false;
    },
  },
  stateProp: {
    type: Boolean,
  },
};
export default {
  components: {
    BaseState,
  },
  props: WidgetInput,
  data() {
    return {
      state1_state: this.state1,
      state2_state: this.state2,
      stateProp_state: this.stateProp,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        state1: this.state1_state,
        state2: this.state2_state,
        stateProp: this.stateProp_state,
        state1Change: this.state1Change,
        state2Change: this.state2Change,
        statePropChange: this.statePropChange,
      };
    },
  },
  watch: {
    state1: ["__state1_watcher"],
    state2: ["__state2_watcher"],
    stateProp: ["__stateProp_watcher"],
  },
  methods: {
    __updateState() {
      (this.state1_state = !this.state1_state),
        this.state1Change(this.state1_state);
    },
    __updateState2() {
      const cur = this.state2_state;
      (this.state2_state = cur !== false ? false : true),
        this.state2Change(this.state2_state);
    },
    __destruct() {
      const s = this.state1_state;
    },
    __stateChange(stateProp) {
      (this.stateProp_state = stateProp),
        this.statePropChange(this.stateProp_state);
    },
    state1Change(...args) {
      this.$emit("update:state1", ...args);
    },
    state2Change(...args) {
      this.$emit("update:state2", ...args);
    },
    statePropChange(...args) {
      this.$emit("update:state-prop", ...args);
    },
    __state1_watcher(s) {
      this.state1_state = s;
    },
    __state2_watcher(s) {
      this.state2_state = s;
    },
    __stateProp_watcher(s) {
      this.stateProp_state = s;
    },
  },
};
</script>
