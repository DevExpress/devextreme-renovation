import registerComponent from '../../../../../component_declaration/jquery_component_registrator';
import Component from '../../../../../component_declaration/jquery_base_component';
import WidgetComponent from '../../../../method.p';

export class Widget extends Component {
    get _viewComponent() {
        return WidgetComponent;
    }

    getHeight(p:number=10, p1: any) {
        this.viewRef.current.getHeight(p, p1);
    }

    getSize() {
        this.viewRef.current.getSize();
    }

    _initWidget() {
        this._createViewRef();
    }
}

registerComponent('Widget', Widget);
