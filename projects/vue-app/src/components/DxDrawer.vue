<script>
export default {
  components: {
  },
  props: {
    height: String,
    hint: String,
    opened: {
      type: Boolean,
      default: undefined
    },
    width: String
  },
  data() {
    return {
      opened_state: this.opened
    };
  },
  methods: {
    onClickHandler() {
      this.opened_state = false;
      this.$emit("opened-change", this.opened_state);
    },

    drawerCSS() {
      return ["dx-drawer-panel"]
        .concat((this.opened !== undefined ? this.opened : this.opened_state) ? "dx-state-visible" : "dx-state-hidden")
        .join(" ");
    },

    style() {
      return {
        width: this.width,
        height: this.height
      };
    },

    view(viewModel) {
      return (
        <div
          class="dx-drawer"
          title={viewModel.hint}
          style={viewModel.style()}>
          <div class={viewModel.drawerCSS()}>
            {
              viewModel.$scopedSlots.drawer()
            }
          </div>
          <div
            class="dx-drawer-content"
            on-click={viewModel.onClickHandler}>
            {
              viewModel.$scopedSlots.default()
            }
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
.dx-drawer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: visible;
}

.dx-drawer .dx-drawer-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
}

.dx-drawer .dx-drawer-panel {
  background-color: #337ab7;
  overflow: visible;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px;
}

.dx-drawer .dx-drawer-panel.dx-state-visible {
  left: 0;
  transition: left 300ms;
}

.dx-drawer .dx-drawer-panel.dx-state-hidden {
  left: -200px;
  transition: left 300ms;
}
</style>

