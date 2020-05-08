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
  state3: {
    type: Boolean,
    default: undefined
  }
};
export default {
  props: WidgetInput,
  data() {
    return {
      state1_state: this.state1 !== undefined ? this.state1 : false,
      state2_state: this.state2 !== undefined ? this.state2 : false,
      state3_state: undefined
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
      this.$emit("state1-change", ...args);
    },
    state2Change(...args){
      this.$emit("state2-change", ...args);
    },
    state3Change(...args){
      this.$emit("state3-change", ...args);
    }
  }
};
</script>
