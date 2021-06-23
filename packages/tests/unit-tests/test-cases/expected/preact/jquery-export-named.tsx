import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import { Widget as WidgetComponent } from "../../../../jquery-export-named";

export default class Widget extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ["prop"],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
