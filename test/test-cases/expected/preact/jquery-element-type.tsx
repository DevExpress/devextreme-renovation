import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component";
import WidgetComponent from "../../../../jquery-element-type";

export default class Widget extends BaseComponent {
  methodWithElementParam(
    arg1: number,
    elementArg: HTMLElement | string
  ): number {
    return this.viewRef.methodWithElementParam(
      arg1,
      this._patchElementParam(elementArg)
    );
  }
  methodWithElementReturn(arg1: number, elementArg: HTMLElement): HTMLElement {
    return this._toPublicElement(
      this.viewRef.methodWithElementReturn(
        arg1,
        this._patchElementParam(elementArg)
      )
    );
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
