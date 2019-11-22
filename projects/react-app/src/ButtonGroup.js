import React, { useCallback, useState } from "react";
import Button from "./Button";

import './ButtonGroup.css'

function viewModel(model) {
  const viewModel = { ...model };
    viewModel.items = viewModel.items.map(item => ({
      ...item,
      pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1
    }))

    return viewModel;
}

function view(viewModel) {
  const buttons = viewModel.items.map((item, index) => (
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

export default function ButtonGroup({
  height,
  hint,
  items = [],
  keyExpr,
  selectionMode,
  stylingMode,
  width,
  selectedItems,
  selectedItemsChange = () => {}
}) {
  const [_selectedItems, _setSelectedItems] = useState(() => selectedItems);

  const onClickHandler = useCallback((index) => {
    let curSelectedItems = (selectedItems !== undefined ? selectedItems : _selectedItems) || [];

    const currentButton = items[index][keyExpr]; 
    if(selectionMode === "single") {
      if(curSelectedItems[0] === currentButton) {
        curSelectedItems = [];
      } else {
        curSelectedItems = [currentButton];
      }
    } else {
      if(curSelectedItems.indexOf(currentButton) !== -1) {
        curSelectedItems = curSelectedItems.filter(item => item !== currentButton);
      } else {
        curSelectedItems = curSelectedItems.concat(currentButton);
      }
    }

    _setSelectedItems(curSelectedItems);
    selectedItemsChange(curSelectedItems);
  }, [_selectedItems, selectedItems, items, keyExpr, selectionMode, selectedItemsChange]);

  return view({ 
    // listeners
    onClickHandler,
    ...viewModel({
      // props
      height,
      hint,
      items,
      keyExpr,
      selectionMode,
      stylingMode,
      width,
      // state
      selectedItems: selectedItems !== undefined ? selectedItems : _selectedItems
      // internal state
    })
  });
}

export class ButtonGroupComponent extends React.Component {
  static defaultProps = {
    defaultSelectedItems: []
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.onClickHandler = this.onClickHandler.bind(this);

    this.state.selectedItems = this.props.defaultSelectedItems;
  }

  get selectedItems() {
    return ("selectedItems" in this.props ? this.props.selectedItems : this.state.selectedItems) || [];
  }

  set selectedItems(selectedItems) {
    this.setState({ selectedItems });
    this.selectedItemsChange(selectedItems);
  }

  get selectedItemsChange() {
    return this.props.selectedItemsChange || (() => {});
  }

  onClickHandler(index) {
    const currentButton = this.props.items[index][this.props.keyExpr]; 
    if(this.props.selectionMode === "single") {
      if(this.selectedItems[0] === currentButton) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [currentButton];
      }
    } else {
      if(this.selectedItems.indexOf(currentButton) !== -1) {
        this.selectedItems = this.selectedItems.filter(item => item !== currentButton);
      } else {
        this.selectedItems = this.selectedItems.concat(currentButton);
      }
    }
  }

  viewModel(model) {
    const viewModel = { ...model };
    viewModel.items = viewModel.items.map(item => ({
      ...item,
      pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1
    }))

    return viewModel;
  }
  
  view(viewModel) {
    const buttons = viewModel.items.map((item, index) => (
      <Button
        stylingMode={viewModel.stylingMode}
        key={index}
        pressed={item.pressed}
        text={item.text}
        type={item.type}
        hint={item.hint || viewModel.hint}
        onClick={this.onClickHandler.bind(this, index)}/>
    ));

    return (
      <div className="dx-button-group">
        {buttons}
      </div>
    );
  }

  getModel() {
    return { ...this.state, ...this.props };
  }

  render() {
    return this.view(this.viewModel(this.getModel()));
  }
};
