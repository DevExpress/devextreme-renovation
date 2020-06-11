import * as Preact from "preact";
import registerComponent from "../../../../component_declaration/jquery_component_registrator";
import BaseComponent from "../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-template.p"

export default class Widget extends BaseComponent {
    getProps(props:any) {
        props.template = this._createTemplateComponent(props, props.template);

        props.anotherTemplate = this._createTemplateComponent(props, props.anotherTemplate);

        props.containerTemplate = this._createTemplateComponent(props, props.containerTemplate);

        props.contentTemplate = this._createTemplateComponent(props, props.contentTemplate, true);

        return props;
    }

    get _viewComponent() {
        return WidgetComponent;
    }
}

registerComponent('dxrWidget', Widget);
