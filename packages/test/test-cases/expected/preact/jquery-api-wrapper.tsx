import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-api-wrapper";

import { MyTypeReturn, MyType } from "./jquery-api";

export default class Widget extends BaseComponent {
  getValue(arg: MyType): MyTypeReturn {
    return this.viewRef.getValue(arg);
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
