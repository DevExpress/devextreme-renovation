import React, { useCallback, useState, useMemo } from "react";
import ToggleButton from "./ToggleButton";

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

  const pressedChange = useCallback((index: number, pressed: boolean) => {
    let curSelectedItems = (props.selectedItems !== undefined ? props.selectedItems : selectedItems);

    const currentButton = props.items![index][props.keyExpr!]; 
    let newValue: string[] = [];

    if(props.selectionMode === "single") {
      newValue = pressed ? [currentButton] : [];
    } else {

      if(pressed) {
        if(curSelectedItems.indexOf(currentButton) === -1) {
          newValue = curSelectedItems.concat(currentButton);
        }
      } else {
        newValue = curSelectedItems.filter((item: string) => item !== currentButton);
      }
    }
    setSelectedItems(newValue);
    props.selectedItemsChange!(newValue);
  }, [selectedItems, props.selectedItems, props.items, props.keyExpr, props.selectionMode, props.selectedItemsChange]);

  const items = useMemo(function() {
    return props.items!.map((item: any) => ({
      ...item,
      pressed: (props.selectedItems !== undefined ? props.selectedItems : selectedItems || []).indexOf(item[props.keyExpr!]) !== -1
    }));
  }, [selectedItems, props.selectedItems, props.items, props.keyExpr]);

  return view({
    // props
    props: {
      ...props,
      // state
      selectedItems: props.selectedItems !== undefined ? props.selectedItems : selectedItems
    },
    // internal state
    // listeners
    pressedChange,
    // viewModel
    items
  });
}

ButtonGroup.defaultProps = {
  keyExpr: "",
  items: [],
  selectedItemsChange: () => {}
};

function view(viewModel: any) {
  const buttons = viewModel.items.map((item: any, index: number) => (
    <ToggleButton
      stylingMode={viewModel.props.stylingMode}
      key={index}
      pressed={item.pressed}
      pressedChange={viewModel.pressedChange.bind(null, index)}
      text={item.text}
      type={item.type}
      hint={item.hint || viewModel.props.hint} />
  ));

  return (
    <div className="dx-button-group">
      {buttons}
    </div>
  );
}

export default ButtonGroup;
