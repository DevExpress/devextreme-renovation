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
    pressed: Boolean
  },
  data() {
    return {};
  },
  methods: {
    onClickHandler() {
      this.pressed = !this.pressed;
      this.$emit("pressed-change", this.pressed);
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
        pressed: this.pressed,
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

