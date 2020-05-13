 <template>
  <div>{{(state1 !== undefined ? state1 : state1_state)}}</div>
</template>
<script>
const WidgetInput = {
  state1: {
    type: Boolean,
    default: undefined
  },
  state2: {
    type: Boolean,
    default: undefined
  },
  stateProp: {
    type: Boolean,
    default: undefined
  },
  defaultState1: {
    type: Boolean,
    default() {
      return false;
    }
  },
  defaultState2: {
    type: Boolean,
    default() {
      return false;
    }
  },
  defaultStateProp: {
    type: Boolean
  }
};
export default {
  props: WidgetInput,
  data() {
    return {
      state1_state: this.defaultState1,
      state2_state: this.defaultState2,
      stateProp_state: this.defaultStateProp
    };
  },
  methods: {
    updateState() {
        this.state1_state = !(this.state1 !== undefined
        ? this.state1
        : this.state1_state),
        this.state1Change(this.state1_state);
    },
    updateState2() {
      const cur = (this.state2 !== undefined ? this.state2 : this.state2_state)
      this.state2_state = cur !== false ? false : true,
      this.state2Change(this.state2_state);
    },
    destruct(){
      const s = (this.state1 !== undefined ? this.state1 : this.state1_state);
    },
    __restAttributes() {
      return {};
    },
    state1Change(...args){
      this.$emit("update:state1", ...args);
    },
    state2Change(...args){
      this.$emit("update:state2", ...args);
    },
    statePropChange(...args){
      this.$emit("update:state-prop", ...args);
    }
  }
};
</script>
