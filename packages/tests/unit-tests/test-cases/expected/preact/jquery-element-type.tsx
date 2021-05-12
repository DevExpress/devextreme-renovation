import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-element-type";

export default class Widget extends BaseComponent {
  methodWithElementParam(
    arg1: number,
    elementArg: HTMLElement | string
  ): number | undefined {
    const params = [arg1, this._patchElementParam(elementArg)];
    const args = [].slice.call(arguments);
    return this.viewRef?.methodWithElementParam(
      ...args.map((a, index) => {
        return params[index];
      })
    );
  }
  methodWithElementReturn(
    arg1: number,
    elementArg: HTMLElement
  ): HTMLElement | undefined {
    const params = [arg1, this._patchElementParam(elementArg)];
    const args = [].slice.call(arguments);
    return this._toPublicElement(
      this.viewRef?.methodWithElementReturn(
        ...args.map((a, index) => {
          return params[index];
        })
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
