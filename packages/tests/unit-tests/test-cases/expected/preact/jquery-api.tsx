import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-api";

import { MyTypeReturn, MyType } from "../../../../jquery-api";

export default class Widget extends BaseComponent {
  getHeight(p: number = 10, p1: any): string | undefined {
    return this.viewRef?.getHeight(arguments);
  }
  getSize(): string | undefined {
    return this.viewRef?.getSize(arguments);
  }
  getValue(arg: MyType): MyTypeReturn | undefined {
    return this.viewRef?.getValue(arguments);
  }
  getValue2(arg: MyType): MyTypeReturn | undefined {
    return this.viewRef?.getValue2(arguments);
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ["prop1", "prop2"],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
