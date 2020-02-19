import React, { useCallback, useState, forwardRef, useRef, useImperativeHandle, useMemo } from "react";

import './List.css'

export type ListRef = {
  export: () => void
}

type ListProps = {
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
}

const List = forwardRef<ListRef, ListProps>((props: ListProps, ref) => {
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


  const host = useRef<HTMLDivElement>();

  useImperativeHandle(ref, () => ({
    export: () => {
      const htmlContent = host.current!.outerHTML;
      const bl = new Blob([htmlContent], {type: "text/html"});
      const a = document.createElement("a");
      a.download = "list.html";
      a.href = URL.createObjectURL(bl);
      a.target = "_blank";
      a.click();
    }
  }));

  const style = useMemo(function() {
    return {
      width: props.width,
      height: props.height
    };
  }, [props.width, props.height]);

  const items = useMemo(function() {
    return props.items!.map((item: any) => {
      const selected = ((props.selectedItems !== undefined ? props.selectedItems : selectedItems) || []).findIndex((selectedItem: any) => selectedItem[props.keyExpr!] === item[props.keyExpr!]) !== -1;
      return {
        ...item,
        text: item[props.displayExpr!],
        key: item[props.keyExpr!],
        selected,
        hovered: !selected && hoveredItemKey === item[props.keyExpr!]
      };
    });
  }, [props.items, props.selectedItems, selectedItems, props.keyExpr, props.displayExpr, hoveredItemKey]);


  return view({
    // props
    props: {
      ...props,
      // state
      selectedItems: props.selectedItems !== undefined ? props.selectedItems : selectedItems
    },
    // internal state
    hoveredItemKey,
    // listeners
    onItemMove,
    selectHandler,
    //refs
    host,
    // viewModel
    style,
    items
  });
});

List.defaultProps = {
  height: "400px",
  keyExpr: "value",
  displayExpr: "value",
  items: [],
  selectedItemsChange: () => {}
};

function view(viewModel: any) {
  const items = viewModel.items.map((item: any) => {
    return (
      <div
        key={item.key}
        className={["dx-list-item"].concat(item.selected ? "dx-state-selected" : "", item.hovered ? "dx-state-hover" : "").join(" ")}
        onClick={viewModel.selectHandler.bind(null, item.key)}
        onPointerMove={viewModel.onItemMove.bind(null, item.key)}
        >
          {viewModel.props.itemRender ? (
            <viewModel.props.itemRender {...item} />
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

export default List;
