import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-state";

export default class Widget extends BaseComponent {
  get _twoWayProps() {
    return [
      ["state1", "state1Change", false],
      ["state2", "state2Change", "default value"],
      [
        "state3",
        "state3Change",
        (e: any) => {
          return e.num;
        },
      ],
      ["state4", "state4Change"],
    ];
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxrWidget", Widget);
