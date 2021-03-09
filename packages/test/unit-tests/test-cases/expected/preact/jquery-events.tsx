import registerComponent from "../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../jquery-events";

export default class Widget extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  _getActionConfigs() {
    return {
      onEventWithoutConfig: {},
      onEventWithConfig: { someAction: "config" },
      onEventWithEmptyConfig: {},
    };
  }

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
