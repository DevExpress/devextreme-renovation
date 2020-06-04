import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import { JQueryCustomBaseComponent } from "../../../component_declaration/jquery_custom_base_component";
import WidgetComponent from "../../../../jquery-custom-named-base.p"

export default class Widget extends JQueryCustomBaseComponent {
  __getProps():any {
    return this.viewRef?.__getProps();
  }

  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('dxrWidget', Widget);
