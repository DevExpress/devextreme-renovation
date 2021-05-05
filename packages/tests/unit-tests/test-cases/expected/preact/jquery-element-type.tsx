import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-element-type";

export default class Widget extends BaseComponent {
  methodWithElementParam(
    arg1: number,
    elementArg: HTMLElement | string
  ): number | undefined {
    return this.viewRef?.methodWithElementParam(
      arg1,
      this._patchElementParam(elementArg)
    );
  }
  methodWithElementReturn(
    arg1: number,
    elementArg: HTMLElement
  ): HTMLElement | undefined {
    return this._toPublicElement(
      this.viewRef?.methodWithElementReturn(
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
      props: [],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
