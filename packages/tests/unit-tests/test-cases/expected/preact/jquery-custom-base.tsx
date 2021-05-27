import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import MyBaseComponent from "../../../../jquery-helpers/jquery_custom_base_component";
import WidgetComponent, {
  defaultOptions,
} from "../../../../jquery-custom-base";

export default class Widget extends MyBaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
Widget.defaultOptions = defaultOptions;
