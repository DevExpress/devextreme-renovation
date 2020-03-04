<script>
// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules = [{
  device: function() {
    return true;
  },
  options: {
    text: "Push me!"
  }
}];

export default {
  components: {},
  props: {
    classNames: Array,
    elementAttr: Object,
    height: {
      type: String,
      default() { return this._defaultOptions.height || "" }
    },
    hint: {
      type: String,
      default() { return this._defaultOptions.hint || "" }
    },
    pressed: Boolean,
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
    }
  },
  beforeCreate() {
    this._defaultOptions = convertRulesToOptions(defaultOptionsRules);
  },
  data() {
    return {
      internal_state_hovered: false,
      internal_state_active: false
    };
  },
  mounted() {
    document.addEventListener("pointerup", this.onPointerUp);
  },
  beforeDestroy() {
    document.removeEventListener("pointerup", this.onPointerUp);
  },
  methods: {
    onPointerOver() {
      this.internal_state_hovered = true;
    },

    onPointerOut() {
      this.internal_state_hovered = false;
    },

    onPointerDown() {
      this.internal_state_active = true;
    },

    onPointerUp() {
      this.internal_state_active = false;
    },

    onClickHandler() {
      this.$emit("on-click", { type: this.type, text: this.text });
    },

    style() {
      return {
        width: this.width
      };
    },

    cssClasses() {
      const classNames = ['dx-button'];

      if(this.stylingMode === 'outlined') {
        classNames.push('dx-button-mode-outlined');
      } else if(this.stylingMode === 'text') {
        classNames.push('dx-button-mode-text');
      } else {
        classNames.push('dx-button-mode-contained');
      }

      if(this.type === 'danger') {
        classNames.push('dx-button-danger');
      } else if(this.type === 'default') {
        classNames.push('dx-button-default');
      } else if(this.type === 'success') {
        classNames.push('dx-button-success');
      } else {
        classNames.push('dx-button-normal');
      }

      if(this.text) {
        classNames.push('dx-button-has-text');
      }

      if(this.internal_state_hovered) {
        classNames.push("dx-state-hover");
      }

      if(this.pressed || this.internal_state_active) {
        classNames.push("dx-state-active");
      }
      return classNames.concat(this.classNames || []).join(" ");
    },

    view(viewModel) {
      return (
        <div
          class={viewModel.cssClasses()}
          title={viewModel.hint}
          style={viewModel.style()}
          {...{attrs:viewModel.elementAttr}}
          on-pointerover={viewModel.onPointerOver}
          on-pointerout={viewModel.onPointerOut}
          on-pointerdown={viewModel.onPointerDown}
          on-click={viewModel.onClickHandler}
        >
          <div class="dx-button-content">
            <span class="dx-button-text">{viewModel.text}</span>
          </div>
        </div>
      );
    }
  },
  render() {
    return this.view(this);
  }
};
</script>
<style>
.dx-button {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  max-width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  padding: 0;
  outline: 0;
}

.dx-button {
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  user-select: none;

  font-weight: normal;
  font-size: 14px;
  font-family: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  line-height: 1.35715;

  box-sizing: border-box;
}

.dx-button-mode-contained {
  background-color: rgb(255, 255, 255);
  color: rgb(51, 51, 51);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-contained.dx-state-hover {
  background-color: rgb(245, 245, 245);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-contained.dx-state-active {
  background-color: rgb(194, 194, 194);
  color: rgb(51, 51, 51);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-contained.dx-button-success {
  background-color: rgb(92, 184, 92);
  color: rgb(255, 255, 255);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-success.dx-state-hover {
  background-color: rgb(53, 121, 53);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-success.dx-state-active {
  background-color: rgb(6, 15, 6);
  color: rgb(255, 255, 255);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-default {
  background-color: rgb(51, 122, 183);
  color: rgb(255, 255, 255);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-default.dx-state-hover {
  background-color: rgb(29, 69, 103);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-default.dx-state-active {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-danger {
  background-color: rgb(217, 83, 79);
  color: rgb(255, 255, 255);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-danger.dx-state-hover {
  background-color: rgb(160, 38, 34);
  border-color: transparent;
}
.dx-button-mode-contained.dx-button-danger.dx-state-active {
  background-color: rgb(34, 8, 7);
  color: rgb(255, 255, 255);
  border-color: transparent;
}

.dx-button-mode-outlined {
  background-color: transparent;
  color: rgb(51, 51, 51);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-outlined.dx-state-hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-outlined.dx-state-active {
  background-color: rgba(0, 0, 0, 0.24);
  color: rgb(51, 51, 51);
  border-color: rgb(221, 221, 221);
}
.dx-button-mode-outlined.dx-button-success {
  background-color: transparent;
  color: rgb(76, 174, 76);
  border-color: rgb(76, 174, 76);
}
.dx-button-mode-outlined.dx-button-success.dx-state-hover {
  background-color: rgba(76, 174, 76, 0.1);
  border-color: rgb(76, 174, 76);
}
.dx-button-mode-outlined.dx-button-success.dx-state-active {
  background-color: rgba(76, 174, 76, 0.4);
  color: rgb(76, 174, 76);
  border-color: rgb(76, 174, 76);
}
.dx-button-mode-outlined.dx-button-default {
  background-color: transparent;
  color: rgb(45, 109, 163);
  border-color: rgb(45, 109, 163);
}
.dx-button-mode-outlined.dx-button-default.dx-state-hover {
  background-color: rgba(45, 109, 163, 0.1);
  border-color: rgb(45, 109, 163);
}
.dx-button-mode-outlined.dx-button-default.dx-state-active {
  background-color: rgba(45, 109, 163, 0.4);
  color: rgb(45, 109, 163);
  border-color: rgb(45, 109, 163);
}
.dx-button-mode-outlined.dx-button-danger {
  background-color: transparent;
  color: rgb(212, 63, 58);
  border-color: rgb(212, 63, 58);
}
.dx-button-mode-outlined.dx-button-danger.dx-state-hover {
  background-color: rgba(212, 63, 58, 0.1);
  border-color: rgb(212, 63, 58);
}
.dx-button-mode-outlined.dx-button-danger.dx-state-active {
  background-color: rgba(212, 63, 58, 0.4);
  color: rgb(212, 63, 58);
  border-color: rgb(212, 63, 58);
}

.dx-button-mode-text {
  background-color: transparent;
  color: rgb(51, 51, 51);
  border-color: transparent;
}
.dx-button-mode-text.dx-state-hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: transparent;
}
.dx-button-mode-text.dx-state-active {
  background-color: rgba(0, 0, 0, 0.24);
  color: rgb(51, 51, 51);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-success {
  background-color: transparent;
  color: rgb(76, 174, 76);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-success.dx-state-hover {
  background-color: rgba(76, 174, 76, 0.1);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-success.dx-state-active {
  background-color: rgba(76, 174, 76, 0.4);
  color: rgb(76, 174, 76);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-default {
  background-color: transparent;
  color: rgb(45, 109, 163);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-default.dx-state-hover {
  background-color: rgba(45, 109, 163, 0.1);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-default.dx-state-active {
  background-color: rgba(45, 109, 163, 0.4);
  color: rgb(45, 109, 163);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-danger {
  background-color: transparent;
  color: rgb(212, 63, 58);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-danger.dx-state-hover {
  background-color: rgba(212, 63, 58, 0.1);
  border-color: transparent;
}
.dx-button-mode-text.dx-button-danger.dx-state-active {
  background-color: rgba(212, 63, 58, 0.4);
  color: rgb(212, 63, 58);
  border-color: transparent;
}

.dx-button-content {
  height: 100%;
  max-height: 100%;
}

.dx-button .dx-button-content {
  padding: 8px;
}

.dx-button-normal.dx-state-hover .dx-button-content {
  background-color: transparent;
  border-radius: 4px;
}

.dx-button-has-text .dx-button-content {
  padding: 7px 18px 8px;
}

.dx-button-has-text .dx-button-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

