import * as Preact from "preact";
import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-events.p"

export default class Widget extends BaseComponent {
  getProps(props:any) {
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);

    return props;
  }

  _getActionConfigs() {
    return {
      onEventWithConfig: { someAction: "config" },
      onEventWithEmptyConfig: {}
    };
  }

  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('dxrWidget', Widget);
