 <template>
  <div>{{(state1 !== undefined ? state1 : state1_state)}}</div>
</template>
<script>
const WidgetInput = {
  state1: {
    type: Boolean
  },
  state2: {
    type: Boolean
  },
  state3: {
    type: Boolean
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
        this.emit("state1-change", this.state1_state);
    },
    updateState2() {
      const cur = (this.state2 !== undefined ? this.state2 : this.state2_state)
      this.state2_state = cur !== false ? false : true,
      this.emit("state2-change", this.state2_state);
    },
    destruct(){
      const s = (this.state1 !== undefined ? this.state1 : this.state1_state);
    },
    __restAttributes() {
      return {};
    }
  }
};
</script>
