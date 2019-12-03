<script>
export default {
  components: {
  },
  props: {
    height: String,
    hint: String,
    opened: Boolean,
    width: String
  },
  data() {
    return {};
  },
  methods: {
    onClickHandler() {
      this.opened = false;
      this.$emit("opened-change", this.opened);
    },

    viewModel(model) {
      return {
        drawerCSS: ["dx-drawer-panel"]
          .concat(model.opened ? "dx-state-visible" : "dx-state-hidden")
          .join(" "),
        style: {
          width: model.width,
          height: model.height
        },
        ...model
      };
    },

    view(viewModel) {
      return (
        <div
          class="dx-drawer"
          title={viewModel.hint}
          style={viewModel.style}>
          <div class={viewModel.drawerCSS}>
            {
              this.$slots.drawer
            }
          </div>
          <div
            class="dx-drawer-content"
            on-click={this.onClickHandler}>
            {
              this.$slots.default
            }
          </div>
        </div>
      );
    }
  },
  render() {
    return this.view(
      this.viewModel({
        height: this.height,
        hint: this.hint,
        opened: this.opened,
        width: this.width
      })
    );
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

