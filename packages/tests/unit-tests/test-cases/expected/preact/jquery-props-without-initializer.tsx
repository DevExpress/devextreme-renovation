import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_custom_base_component";
import WidgetComponent from "../../../../jquery-props-info";

export default class Widget extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [
        ["state1", false, "state1Change"],
        ["state2", undefined, "state2Change"],
        [
          "state3",
          (e: any) => {
            return e.num;
          },
          "state3Change",
        ],
        ["state4", undefined, "state4Change"],
      ],
      allowNull: ["prop1", "defaultState4", "state4"],
      elements: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
