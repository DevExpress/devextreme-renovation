import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-events.p"

export default class Widget extends Component {
  getProps(props:any) {
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);

    return props;
  }

  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('Widget', Widget);
