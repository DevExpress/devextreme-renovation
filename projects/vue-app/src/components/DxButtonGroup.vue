<script>
import DxButton from "./DxButton";

export default {
  components: {
    DxButton
  },
  props: {
    height: String,
    hint: String,
    items: Array,
    keyExpr: String,
    selectionMode: String,
    stylingMode: String,
    width: String,
    selectedItems: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      selectedItems_state: this.selectedItems || []
    };
  },
  methods: {
    onClickHandler(index) {
      let curSelectedItems = (this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state);

      const currentButton = this.items[index][this.keyExpr]; 
      let newValue = [];

      if(this.selectionMode === "single") {
        if(curSelectedItems[0] !== currentButton) {
          newValue = [currentButton];
        }
      } else {
        if(curSelectedItems.indexOf(currentButton) !== -1) {
          newValue = curSelectedItems.filter(item => item !== currentButton);
        } else {
          newValue = curSelectedItems.concat(currentButton);
        }
      }
      this.selectedItems_state = newValue;
      this.$emit("selected-items-change", this.selectedItems_state);
    },

    viewModel(model) {
      const viewModel = { ...model };
      viewModel.items = viewModel.items.map(item => ({
        ...item,
        pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1
      }));

      return viewModel;
    },

    view(viewModel) {
      const buttons = viewModel.items.map((item, index) => (
        <DxButton
          key={item.key}
          pressed={item.pressed}
          stylingMode={viewModel.stylingMode}
          text={item.text}
          type={item.type}
          hint={item.hint || viewModel.hint}
          vOn:on-click={this.onClickHandler.bind(this, index)}
        />
      ));

      return <div class="dx-button-group">{buttons}</div>;
    }
  },
  render() {
    return this.view(
      this.viewModel({
        height: this.height,
        hint: this.hint,
        stylingMode: this.stylingMode,
        width: this.width,
        items: this.items,
        keyExpr: this.keyExpr,
        selectionMode: this.selectionMode,
        selectedItems: this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state
      })
    );
  }
};
</script>
<style>
.dx-button-group {
  display: inline-block;
}

.dx-button-group .dx-button-mode-outlined,
.dx-button-group .dx-button-mode-contained {
  border-radius: 0;
}

.dx-button-group .dx-button-mode-outlined,
.dx-button-group .dx-button-mode-contained {
  padding-left: 1px;
  padding-right: 1px;
  border-left-width: 0;
}

.dx-button-group .dx-button-mode-outlined:first-child,
.dx-button-group .dx-button-mode-contained:first-child,
.dx-button-group .dx-button-mode-outlined.dx-state-hover:first-child,
.dx-button-group .dx-button-mode-contained.dx-state-hover:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding-left: 0;
  border-left-width: 1px;
}

.dx-button-group .dx-button-mode-outlined:last-child,
.dx-button-group .dx-button-mode-contained:last-child,
.dx-button-group .dx-button-mode-outlined.dx-state-hover:last-child,
.dx-button-group .dx-button-mode-contained.dx-state-hover:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>

