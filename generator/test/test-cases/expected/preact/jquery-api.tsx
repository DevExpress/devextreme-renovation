import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-api";

export default class Widget extends BaseComponent {
  getHeight(p: number = 10, p1: any): string {
    return this.viewRef.getHeight(p, p1);
  }

  getSize(): string {
    return this.viewRef.getSize();
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
