import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-api-wrapper";

import { MyTypeReturn, MyType } from "./jquery-api";

export default class Widget extends BaseComponent {
  getValue(arg: MyType): MyTypeReturn | undefined {
    return this.viewRef?.getValue(arguments);
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
