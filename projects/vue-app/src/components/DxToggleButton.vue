<script>
import DxButton from "./DxButton";

export default {
  components: {
    DxButton
  },
  props: {
    height: String,
    hint: String,
    stylingMode: String,
    text: String,
    type: String,
    width: String,
    pressed: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      pressed_state: this.pressed || false
    };
  },
  methods: {
    onClickHandler() {
      const newPressed = !(this.pressed !== undefined ? this.pressed : this.pressed_state);
      this.pressed_state = newPressed;
      this.$emit("pressed-change", this.pressed_state);
    },

    viewModel(model) {
      return { ...model };
    },

    view(viewModel) {
      return (
        <DxButton
          height={viewModel.height}
          hint={viewModel.hint}
          stylingMode={viewModel.stylingMode}
          text={viewModel.text}
          type={viewModel.type}
          width={viewModel.width}
          pressed={viewModel.pressed}
          vOn:on-click={this.onClickHandler}
        />
      );
    }
  },
  render() {
    return this.view(
      this.viewModel({
        height: this.height,
        hint: this.hint,
        pressed: this.pressed !== undefined ? this.pressed : this.pressed_state,
        stylingMode: this.stylingMode,
        text: this.text,
        type: this.type,
        width: this.width
      })
    );
  }
};
</script>
<style>
</style>

