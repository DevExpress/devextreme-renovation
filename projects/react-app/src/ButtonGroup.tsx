import React, { useCallback, useState } from "react";
import Button from "./Button";

import './ButtonGroup.css'

const ButtonGroup = (props: {
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
  const [selectedItems, setSelectedItems] = useState(() => ((props.selectedItems !== undefined) ? props.selectedItems : props.defaultSelectedItems) || []);

  const onClickHandler = useCallback((index) => {
    let curSelectedItems = (props.selectedItems !== undefined ? props.selectedItems : selectedItems);

    const currentButton = props.items![index][props.keyExpr!]; 
    let newValue: string[] = [];

    if(props.selectionMode === "single") {
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
    setSelectedItems(newValue);
    props.selectedItemsChange!(newValue);
  }, [selectedItems, props.selectedItems, props.items, props.keyExpr, props.selectionMode, props.selectedItemsChange]);

  return view(viewModel({
    // props
    ...props,
    // state
    selectedItems: props.selectedItems !== undefined ? props.selectedItems : selectedItems,
    // internal state
    // listeners
    onClickHandler
  }));
}

ButtonGroup.defaultProps = {
  keyExpr: "",
  items: [],
  selectedItemsChange: () => {}
};

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
