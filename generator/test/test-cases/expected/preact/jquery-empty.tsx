import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-empty";

export default class Widget extends BaseComponent {
  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxrWidget", Widget);
