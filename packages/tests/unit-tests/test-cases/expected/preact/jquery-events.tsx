import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent, { defaultOptions } from "../../../../jquery-events";

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
      props: [
        "onKeyDown",
        "onEventWithoutConfig",
        "onEventWithConfig",
        "onEventWithEmptyConfig",
      ],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
Widget.defaultOptions = defaultOptions;
