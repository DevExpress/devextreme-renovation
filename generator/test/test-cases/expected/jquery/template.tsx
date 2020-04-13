import registerComponent from '../../../../../component_declaration/jquery_component_registrator';
import Component from '../../../../../component_declaration/jquery_base_component';
import WidgetComponent from '../../../../template.p';

export class Widget extends Component {
    get _viewComponent() {
        return WidgetComponent;
    }

    getProps(props:any) {
        if(props.template) {
            props.render = this._createTemplateComponent(props, 'template');
        }

        if(props.contentTemplate) {
            props.contentRender = this._createTemplateComponent(props, 'contentTemplate');
        }

        return props;
    }
}

registerComponent('Widget', Widget);
