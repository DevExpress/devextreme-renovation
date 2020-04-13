import registerComponent from '../../../../../component_declaration/jquery_component_registrator';
import Component from '../../../../../component_declaration/jquery_base_component';
import WidgetComponent from '../../../../empty-component.p';

export class Widget extends Component {
    get _viewComponent() {
        return WidgetComponent;
    }
}

registerComponent('Widget', Widget);
