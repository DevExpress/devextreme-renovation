import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import MyBaseComponent from "../../../component_declaration/jquery_custom_base_component";
import WidgetComponent from "../../../../jquery-custom-base.p"

export default class Widget extends MyBaseComponent {
  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('dxrWidget', Widget);
