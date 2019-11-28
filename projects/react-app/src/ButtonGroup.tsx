import React, { useCallback, useState } from "react";
import Button from "./Button";

import './ButtonGroup.css'

const ButtonGroup = ({
  height,
  hint,
  items = [],
  keyExpr = "",
  selectionMode,
  stylingMode,
  width,
  selectedItems,
  defaultSelectedItems,
  selectedItemsChange = () => {}
}: {
  height?: string,
  hint?: string,
  items?: any[],
  keyExpr?: string,
  selectionMode?: string,
  stylingMode?: string,
  width?: string,
  selectedItems?: string[],
  defaultSelectedItems?: string[],
  selectedItemsChange?: (e: string[]) => void
}) => {
  const [_selectedItems, _setSelectedItems] = useState(() => (selectedItems !== undefined) ? selectedItems : defaultSelectedItems);

  const onClickHandler = useCallback((index) => {
    let curSelectedItems = (selectedItems !== undefined ? selectedItems : _selectedItems) || [];

    const currentButton = items[index][keyExpr]; 
    let newValue: string[] = [];

    if(selectionMode === "single") {
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
    _setSelectedItems(newValue);
    selectedItemsChange(newValue);
  }, [_selectedItems, selectedItems, items, keyExpr, selectionMode, selectedItemsChange]);

  return view(viewModel({
    // props
    height,
    hint,
    items,
    keyExpr,
    selectionMode,
    stylingMode,
    width,
    // state
    selectedItems: selectedItems !== undefined ? selectedItems : _selectedItems,
    // internal state
    // listeners
    onClickHandler
  }));
}

function viewModel(model: any) {
  const viewModel = { ...model };
    viewModel.items = viewModel.items.map((item: any) => ({
      ...item,
      pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1
    }))

    return viewModel;
}

function view(viewModel: any) {
  const buttons = viewModel.items.map((item: any, index: number) => (
    <Button
      stylingMode={viewModel.stylingMode}
      key={index}
      pressed={item.pressed}
      text={item.text}
      type={item.type}
      hint={item.hint || viewModel.hint}
      onClick={viewModel.onClickHandler.bind(null, index)}/>
  ));

  return (
    <div className="dx-button-group">
      {buttons}
    </div>
  );
}

export default ButtonGroup;
