import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-template.p"

export default class Widget extends Component {
    getProps(props:any) {
        props.render = this._createTemplateComponent(props, props.template);

        props.anotherRender = this._createTemplateComponent(props, props.anotherTemplate);

        props.containerRender = this._createTemplateComponent(props, props.containerTemplate);

        props.contentRender = this._createTemplateComponent(props, props.contentTemplate, true);

        return props;
    }

    get _viewComponent() {
        return WidgetComponent;
    }
}

registerComponent('Widget', Widget);
