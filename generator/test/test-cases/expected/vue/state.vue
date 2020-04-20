<template>
    <div>{(pressed !== undefined ? pressed : pressed_state)}</div>
</template> 
 <script>
const WidgetInput = {
  pressed: {
    type: Boolean
  },
  s: {
    type: Boolean
  }
};
export default {
  props: WidgetInput,
  data() {
    return {
      pressed_state: this.pressed !== undefined ? this.pressed : false,
      s_state: undefined
    };
  },
  methods: {
    updateState() {
      this.pressed_state = !(this.pressed !== undefined
        ? this.pressed
        : this.pressed_state);
    },
    restAttributes() {
      return {};
    }
  }
};
</script>