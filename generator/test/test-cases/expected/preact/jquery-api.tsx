import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-api.p"

export default class Widget extends BaseComponent {
    getHeight(p:number=10, p1: any) {
        this.viewRef.current.getHeight(p, p1);
    }

    getSize() {
        this.viewRef.current.getSize();
    }

    get _viewComponent() {
        return WidgetComponent;
    }

    _initWidget() {
        this._createViewRef();
    }
}

registerComponent('dxrWidget', Widget);
