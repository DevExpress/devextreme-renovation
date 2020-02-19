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

    style() {
      return {
        width: this.width,
        height: this.height
      };
    },

    itemsVM() {
      return this.items.map(item => {
        const selected = ((this.selectedItems !== undefined ? this.selectedItems : this.selectedItems_state) || []).findIndex(selectedItem => selectedItem[this.keyExpr] === item[this.keyExpr]) !== -1;
        return {
          ...item,
          text: item[this.displayExpr],
          key: item[this.keyExpr],
          selected,
          hovered: !selected && this.hoveredItemKey === item[this.keyExpr]
        };
      });
    },

    view(viewModel) {
      const items = viewModel.itemsVM().map((item) => {
        return (
          <div
            key={item.key}
            class={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
            on-click={viewModel.selectHandler.bind(null, item.key)}
            on-pointermove={viewModel.onItemMove.bind(null, item.key)}
            >
              {viewModel.$scopedSlots["item-render"] ? (
                viewModel.$scopedSlots["item-render"](item)
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
          style={viewModel.style()}
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
    return this.view(this);
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

