<script>
export default {
  components: {
  },
  props: {
    height: String,
    hint: String,
    itemRender: {
      type: [String, Object],
      default: 'div'
    },
    items: Array,
    keyExpr: {
      type: String,
      default: () => "value"
    },
    displayExpr: {
      type: String,
      default: () => "value"
    },
    selectedItems: {
      type: Array,
      default: undefined
    },
    width: String
  },
  data() {
    return {
      selectedItems_state: this.selectedItems || [],
      hoveredItemKey: ""
    };
  },
  methods: {
    onItemMove(key) {
      this.hoveredItemKey = key;
    },

    selectHandler(key) {
      const curSelectedItems = (this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state);
    
      const index = curSelectedItems.findIndex(item => item[this.keyExpr] === key);
      let newValue = [];
      if(index >= 0) {
        newValue = curSelectedItems.filter(item => item[this.keyExpr] !== key);
      } else {
        newValue = curSelectedItems.concat(this.items.find(item => item[this.keyExpr] === key));
      }
      
      this.selectedItems_state = newValue;
      this.$emit("selected-items-change", this.selectedItems_state);
    },

    viewModel(model) {
      const viewModel = { 
        ...model,
        style: {
          width: model.width,
          height: model.height
        }
      };
      viewModel.items = viewModel.items.map(item => {
        const selected = (model.selectedItems || []).findIndex(selectedItem => selectedItem[model.keyExpr] === item[model.keyExpr]) !== -1;
        return {
          ...item,
          text: item[model.displayExpr],
          key: item[model.keyExpr],
          selected,
          hovered: !selected && viewModel.hoveredItemKey === item[model.keyExpr]
        };
      });

      return viewModel;
    },

    view(viewModel) {
      const items = viewModel.items.map((item) => {
        return (
          <div
            key={item.key}
            class={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
            on-click={this.selectHandler.bind(this, item.key)}
            on-pointermove={this.onItemMove.bind(this, item.key)}
            >
              {this.$scopedSlots["item-render"] ? (
                this.$scopedSlots["item-render"](item)
              ) : (
                item.text
              )}
          </div>
        );
      });

      return (
        <div
          ref="host"
          class="dx-list"
          style={viewModel.style}
          title={viewModel.hint}>
          <div class="dx-list-content">
            { items }
          </div>
        </div>
      );
    },

    export() {
      const htmlContent = this.$refs.host.outerHTML;
      const bl = new Blob([htmlContent], {type: "text/html"});
      const a = document.createElement("a");
      a.download = "list.html";
      a.href = URL.createObjectURL(bl);
      a.target = "_blank";
      a.click();
    }
  },
  render() {
    return this.view(
      this.viewModel({
        height: this.height,
        hint: this.hint,
        width: this.width,
        items: this.items,
        keyExpr: this.keyExpr,
        displayExpr: this.displayExpr,
        selectedItems: this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state,
        hoveredItemKey: this.hoveredItemKey
      })
    );
  }
};
</script>
<style>
.dx-list {
    overflow: scroll;
}

.dx-list-item {
    border-top: 1px solid #ddd;
    color: #333;
    padding: 10px;
}

.dx-list-item:first-of-type {
    border-top: none;
}

.dx-list-item.dx-state-selected {
    background-color: #337ab3;
    color: #fff;
}

.dx-list-item.dx-state-hover {
    background-color: rgba(0,0,0,0.04);
}
</style>

