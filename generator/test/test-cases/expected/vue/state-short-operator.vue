<template>
  <div ></div>
</template>

<script>
const WidgetInput = {
  propState: {
    type: Number,
    default: undefined
  },
  defaultPropState: {
    type: Number,
    default(){
      return 1
    }
  }
};

export default {
  props: WidgetInput,
  data() {
    return {
      innerState: 0,
      propState_state: this.defaultPropState
    };
  },
  methods: {
    updateState(){
      this.innerState=this.innerState+1
      this.innerState=this.innerState+1
      this.innerState=this.innerState+1
      this.innerState=this.innerState+1
      this.propState_state=(this.propState !== undefined ? this.propState : this.propState_state)+1,
      this.propStateChange(this.propState_state)
      this.propState_state=(this.propState !== undefined ? this.propState : this.propState_state)+1,
      this.propStateChange(this.propState_state)
      this.propState_state=(this.propState !== undefined ? this.propState : this.propState_state)+1,
      this.propStateChange(this.propState_state)
      this.propState_state=(this.propState !== undefined ? this.propState : this.propState_state)+1,
      this.propStateChange(this.propState_state)
    },
    __restAttributes(){
      return {}
    },
    props(){
      return {
        propState:(this.propState !== undefined ? this.propState : this.propState_state),
        propStateChange:this.propStateChange
      };
    },
    propStateChange(...args){
      this.$emit("update:prop-state", ...args);
    }
  }
}
</script>