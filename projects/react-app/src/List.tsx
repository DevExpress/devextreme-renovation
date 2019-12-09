import React, { useCallback, useState } from "react";

import './List.css'

const List = (props: {
  height?: string,
  hint?: string,
  itemRender?: (e: any) => React.ReactNode,
  items?: any[],
  keyExpr?: string,
  displayExpr?: string,
  width?: string,
  selectedItems?: any[],
  defaultSelectedItems?: any[],
  selectedItemsChange?: (e: any[]) => void
}) => {
  const [hoveredItemKey, setHoveredItemKey] = useState("");
  const onItemMove = useCallback((key: string, e: any) => setHoveredItemKey(key), []);

  const [selectedItems, setSelectedItems] = useState(() => ((props.selectedItems !== undefined) ? props.selectedItems : props.defaultSelectedItems) || []);

  const selectHandler = useCallback((key: any) => {
    const curSelectedItems = (props.selectedItems !== undefined ? props.selectedItems : selectedItems);
    
    const index = curSelectedItems!.findIndex(item => item[props.keyExpr!] === key);
    let newValue: any[] = [];
    if(index >= 0) {
      newValue = curSelectedItems!.filter(item => item[props.keyExpr!] !== key);
    } else {
      newValue = curSelectedItems!.concat(props.items!.find(item => item[props.keyExpr!] === key));
    }
    
    setSelectedItems(newValue);
    props.selectedItemsChange!(newValue);
  }, [selectedItems, props.selectedItems, props.items, props.keyExpr, props.selectedItemsChange]);

  return view(viewModel({
    // props
    ...props,
    // state
    selectedItems: props.selectedItems !== undefined ? props.selectedItems : selectedItems,
    // internal state
    hoveredItemKey,
    // listeners
    onItemMove,
    selectHandler
  }));
}

List.defaultProps = {
  height: "400px",
  keyExpr: "value",
  displayExpr: "value",
  items: [],
  selectedItemsChange: () => {}
};

function viewModel(model: any) {
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

export default List;
