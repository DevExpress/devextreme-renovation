import { Component, ComponentBindings, JSXComponent, Slot, OneWay, React, TwoWay, Listen } from '../generator/component_declaration/common';

import './drawer.css';

@ComponentBindings()
export class DrawerInput {
  @OneWay() height?: string;
  @OneWay() hint?: string;
  @OneWay() width?: string;

  @TwoWay() opened?: boolean;

  @Slot() drawer: any;
  @Slot() default: any;
}

@Component({
  name: 'Drawer',
  components: [],
  viewModel() {},
  view
})
export default class Drawer extends JSXComponent<DrawerInput> {
  @Listen()
  onClickHandler(e: any) {
    this.props.opened = false;
  }

  get drawerCSS() {
    return ["dx-drawer-panel"].concat(this.props.opened ? "dx-state-visible" : "dx-state-hidden").join(" ");
  }
  
  get style() {
    return {
      width: this.props.width,
      height: this.props.height
    };
  }
}

function view(viewModel: Drawer) {
  return (
    <div
      className="dx-drawer"
      title={viewModel.props.hint}
      style={viewModel.style}>
      <div className={viewModel.drawerCSS}>
        { viewModel.props.drawer }
      </div>
      <div
        className="dx-drawer-content"
        onClick={viewModel.onClickHandler}>
        { viewModel.props.default }
      </div>
    </div>
  );
}

