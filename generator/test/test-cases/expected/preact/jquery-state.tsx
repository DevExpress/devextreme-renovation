import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-state";

export default class Widget extends BaseComponent {
  get _twoWayProps() {
    return [
        ['state1', 'defaultState1', 'state1Change'],
        ['state2', 'defaultState2', 'state2Change']
    ]
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxrWidget", Widget);
