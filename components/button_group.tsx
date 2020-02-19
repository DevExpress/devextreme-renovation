import { Component, ComponentBindings, JSXComponent, OneWay, React, TwoWay } from '../generator/component_declaration/common';

import ToggleButton from "./toggle_button";
import './button_group.css';

@ComponentBindings()
export class ButtonGroupInput {
  @OneWay() height?: string;
  @OneWay() hint?: string;
  @OneWay() items?: any[] = [];
  @OneWay() keyExpr?: string = "";
  @OneWay() selectionMode?: string;
  @OneWay() stylingMode?: string;
  @OneWay() width?: string;

  @TwoWay() selectedItems?: string[] = [];
}
@Component({
  name: 'ButtonGroup',
  components: [ToggleButton],
  viewModel() {},
  view: viewFunction
})
export default class ButtonGroup extends JSXComponent<ButtonGroupInput> {
  pressedChange(index: number, pressed: boolean) {
    const currentButton = this.props.items![index][this.props.keyExpr!]; 
    let newValue: string[] = [];

    if(this.props.selectionMode === "single") {
      newValue = pressed ? [currentButton] : [];
    } else {
      if(pressed) {
        if(this.props.selectedItems!.indexOf(currentButton) === -1) {
          newValue = this.props.selectedItems!.concat(currentButton);
        }
      } else {
        newValue = this.props.selectedItems!.filter((item: string) => item !== currentButton);
      }
    }
    this.props.selectedItems = newValue;
  }

  get items() {
    return this.props.items!.map((item: any, i: number, array: any[]) => ({
      ...item,
      pressed: (this.props.selectedItems || []).indexOf(item[this.props.keyExpr!]) !== -1,
      classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
    }));
  }
}

function viewFunction(viewModel: ButtonGroup) {
  const buttons = viewModel.items.map((item: any, index: number) => (
    <ToggleButton
      stylingMode={viewModel.props.stylingMode}
      key={item.key}
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
