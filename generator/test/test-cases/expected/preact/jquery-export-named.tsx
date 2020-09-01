import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import { Widget as WidgetComponent } from "../../../../jquery-export-named";

export default class Widget extends BaseComponent {
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
