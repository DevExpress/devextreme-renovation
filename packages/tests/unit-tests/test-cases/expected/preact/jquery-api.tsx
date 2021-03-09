import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-api";

import { MyTypeReturn, MyType } from "../../../../jquery-api";

export default class Widget extends BaseComponent {
  getHeight(p: number = 10, p1: any): string {
    return this.viewRef.getHeight(p, p1);
  }
  getSize(): string {
    return this.viewRef.getSize();
  }
  getValue(arg: MyType): MyTypeReturn {
    return this.viewRef.getValue(arg);
  }
  getValue2(arg: MyType): MyTypeReturn {
    return this.viewRef.getValue2(arg);
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
