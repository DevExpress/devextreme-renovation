@Component({
  name: 'List',
  components: [],
  viewModel,
  view
})

export default class List {
  @Prop() height?: string = "400px";
  @Prop() hint?: string;
  @Prop() items?: any[] = [];
  @Prop() keyExpr?: string = 'value';
  @Prop() displayExpr?: string = 'value';
  @Prop() width?: string;

  @InternalState() hoveredItemKey: string = "";

  @Template() itemRender?: any;

  @State() selectedItems?: any[] = [];

  @Listen()
  onItemMove(key: string) {
    this.hoveredItemKey = key;
  }

  @Listen()
  selectHandler(key: any) {
    const index = this.selectedItems!.findIndex(item => item[this.keyExpr!] === key);
    let newValue: any[] = [];
    if(index >= 0) {
      newValue = this.selectedItems!.filter(item => item[this.keyExpr!] !== key);
    } else {
      newValue = this.selectedItems!.concat(this.items!.find(item => item[this.keyExpr!] === key));
    }
    
    this.selectedItems = newValue;
  }
}

function viewModel(model: List) {
  const viewModel = { 
    ...model,
    style: {
      width: model.width,
      height: model.height
    }
  };

  viewModel.items = viewModel.items!.map((item: any) => {
    const selected = (model.selectedItems || []).findIndex((selectedItem: any) => selectedItem[model.keyExpr!] === item[model.keyExpr!]) !== -1;
    return {
      ...item,
      text: item[model.displayExpr!],
      key: item[model.keyExpr!],
      selected,
      hovered: !selected && viewModel.hoveredItemKey === item[model.keyExpr!]
    };
  });

  return viewModel;
}

function view(viewModel: any) {
  const items = viewModel.items.map((item: any) => {
    return (
      <div
        key={item.key}
        className={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
        onClick={viewModel.selectHandler.bind(null, item.key)}
        onPointerMove={viewModel.onItemMove.bind(null, item.key)}
        >
          {viewModel.itemRender ? (
            <viewModel.itemRender {...item} />
          ) : (
            item.text
          )}
      </div>
    );
  });

  return (
    <div
      className="dx-list"
      style={viewModel.style}
      title={viewModel.hint}>
      <div className="dx-list-content">
        { items }
      </div>
    </div>
  );
}
