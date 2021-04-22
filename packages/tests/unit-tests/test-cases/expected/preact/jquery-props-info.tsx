import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-props-info";

export default class Widget extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [
        ["state1", false, "state1Change"],
        ["state2", "default value", "state2Change"],
        [
          "state3",
          (e: any) => {
            return e.num;
          },
          "state3Change",
        ],
        ["state4", null, "state4Change"],
      ],
      allowNull: ["prop1", "defaultState4", "state4"],
      elements: ["target1", "target2"],
      templates: [],
      props: [
        "prop1",
        "prop2",
        "target1",
        "target2",
        "defaultState1",
        "state1Change",
        "defaultState2",
        "state2Change",
        "defaultState3",
        "state3Change",
        "defaultState4",
        "state4Change",
        "state1",
        "state2",
        "state3",
        "state4",
      ],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
