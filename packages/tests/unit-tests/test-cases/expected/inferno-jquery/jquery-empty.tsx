import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-empty";

export default class Widget extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ["height", "width"],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
