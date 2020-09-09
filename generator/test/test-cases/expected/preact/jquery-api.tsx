import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-api";

export default class Widget extends BaseComponent {
  __getHeight(p: number = 10, p1: any): string {
    return this.viewRef.__getHeight(p, p1);
  }
  __getSize(): string {
    return this.viewRef.__getSize();
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
