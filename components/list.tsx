import { Component, ComponentBindings, JSXComponent, Template, OneWay, React, TwoWay, Method, Listen, Ref } from '../generator/component_declaration/common';

@ComponentBindings()
export class ListInput {
  @OneWay() height?: string = "400px";
  @OneWay() hint?: string;
  @OneWay() items?: any[] = [];
  @OneWay() keyExpr?: string = 'value';
  @OneWay() displayExpr?: string = 'value';
  @OneWay() width?: string;

  @Template() itemRender?: any;

  @TwoWay() selectedItems?: any[] = [];
}

@Component({
  name: 'List',
  components: [],
  viewModel() {},
  view
})
export default class List extends JSXComponent<ListInput> {
  @Ref() host!: HTMLDivElement;

  hoveredItemKey: string = "";

  @Listen()
  onItemMove(key: string) {
    this.hoveredItemKey = key;
  }

  @Listen()
  selectHandler(key: any) {
    const index = this.props.selectedItems!.findIndex(item => item[this.props.keyExpr!] === key);
    let newValue: any[] = [];
    if(index >= 0) {
      newValue = this.props.selectedItems!.filter(item => item[this.props.keyExpr!] !== key);
    } else {
      newValue = this.props.selectedItems!.concat(this.items!.find(item => item[this.props.keyExpr!] === key));
    }
    
    this.props.selectedItems = newValue;
  }

  @Method() 
  export() {
    const htmlContent = this.host.outerHTML;
    const bl = new Blob([htmlContent], {type: "text/html"});
    const a = document.createElement("a");
    a.download = "list.html";
    a.href = URL.createObjectURL(bl);
    a.target = "_blank";
    a.click();
  }

  get style() {
    return {
      width: this.props.width,
      height: this.props.height
    };
  }

  get items() {
    return this.props.items!.map((item: any) => {
      const selected = (this.props.selectedItems || []).findIndex((selectedItem: any) => selectedItem[this.props.keyExpr!] === item[this.props.keyExpr!]) !== -1;
      return {
        item,
        text: item[this.props.displayExpr!],
        key: item[this.props.keyExpr!],
        selected,
        hovered: !selected && this.hoveredItemKey === item[this.props.keyExpr!]
      };
    });
  }
}

function view(viewModel: List) {
  const items = viewModel.items.map((item: any) => {
    return (
      <div
        key={item.key}
        className={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
        onClick={viewModel.selectHandler.bind(null, item.key)}
        onPointerMove={viewModel.onItemMove.bind(null, item.key)}
        >
          {viewModel.props.itemRender ? (
            <viewModel.props.itemRender {...item.item} />
          ) : (
            item.text
          )}
      </div>
    );
  });

  return (
    <div
      ref={viewModel.host}
      className="dx-list"
      style={viewModel.style}
      title={viewModel.props.hint}>
      <div className="dx-list-content">
        { items }
      </div>
    </div>
  );
}
