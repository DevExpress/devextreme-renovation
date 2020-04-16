import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-empty.p"

export default class Widget extends Component {
  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('Widget', Widget);
