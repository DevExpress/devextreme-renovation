<script>
import DxButton from "./DxButton";
import DxToggleButton from "./DxToggleButton";

export default {
  components: {
    DxButton,
    DxToggleButton
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
    pressedChange(index, pressed) {
      let curSelectedItems = (this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state);

      const currentButton = this.items[index][this.keyExpr]; 
      let newValue = [];

      if(this.selectionMode === "single") {
        newValue = pressed ? [currentButton] : [];
      } else {
        if(pressed) {
          if(curSelectedItems.indexOf(currentButton) === -1) {
            newValue = curSelectedItems.concat(currentButton);
          }
        } else {
          newValue = curSelectedItems.filter((item) => item !== currentButton);
        }
      }
      this.selectedItems_state = newValue;
      this.$emit("selected-items-change", this.selectedItems_state);
    },

    itemsVM() {
      return this.items.map((item) => ({
        ...item,
        pressed: ((this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state) || []).indexOf(item[this.keyExpr]) !== -1
      }));
    },

    view(viewModel) {
      const buttons = viewModel.itemsVM().map((item, index) => (
        <DxToggleButton
          key={item.key}
          pressed={item.pressed}
          vOn:pressed-change={viewModel.pressedChange.bind(null, index)}
          stylingMode={viewModel.stylingMode}
          text={item.text}
          type={item.type}
          hint={item.hint || viewModel.hint}
        />
      ));

      return <div class="dx-button-group">{buttons}</div>;
    }
  },
  render() {
    return this.view(this);
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

