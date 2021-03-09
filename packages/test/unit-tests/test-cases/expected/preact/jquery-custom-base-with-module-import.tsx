import registerComponent from "../../../component_declaration/jquery_component_registrator";
import MyBaseComponent from "../../../../component_declaration/jquery_custom_base_component";
import WidgetComponent from "../../../jquery-custom-base-with-module-import";

export default class Widget extends MyBaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
