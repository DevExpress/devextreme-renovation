<script>
import DxButton, { defaultOptionsRules as buttonRules } from "./DxButton";

// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules = buttonRules.concat([{
  device: function() {
    return true;
  },
  options: {
    hint: "Toggle button"
  }
}]);

export default {
  components: {
    DxButton
  },
  props: {
    height: {
      type: String,
      default() { return this._defaultOptions.height || "" }
    },
    hint: {
      type: String,
      default() { return this._defaultOptions.hint || "" }
    },
    stylingMode: {
      type: String,
      default() { return this._defaultOptions.stylingMode || "" }
    },
    text: {
      type: String,
      default() { return this._defaultOptions.text || "" }
    },
    type: {
      type: String,
      default() { return this._defaultOptions.type || "" }
    },
    width: {
      type: String,
      default() { return this._defaultOptions.width || "" }
    },
    pressed: {
      type: Boolean,
      default: undefined
    }
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(defaultOptionsRules);
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

    view(viewModel) {
      return (
        <DxButton
          height={viewModel.height}
          hint={viewModel.hint}
          stylingMode={viewModel.stylingMode}
          text={viewModel.text}
          type={viewModel.type}
          width={viewModel.width}
          pressed={viewModel.pressed !== undefined ? viewModel.pressed : viewModel.pressed_state}
          vOn:on-click={this.onClickHandler}
        />
      );
    }
  },
  render() {
    return this.view(this);
  }
};
</script>
<style>
</style>

