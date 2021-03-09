import registerComponent from "../../../component_declaration/jquery_component_registrator";
import { JQueryCustomBaseComponent } from "../../../../component_declaration/jquery_custom_base_component";
import WidgetComponent from "../../../jquery-custom-named-base";

export default class Widget extends JQueryCustomBaseComponent {
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
