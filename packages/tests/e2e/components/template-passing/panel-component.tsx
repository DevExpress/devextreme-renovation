import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Template,
} from "@devextreme-generator/declaration";
import BodyComponent from "./body-component";

const lorem = "Lorem ipsum dolor sit amet consectetur, adipisicing elit";

function view(vm: PanelComponent) {
  return (
    <div>
      <div>
        <vm.props.headerTemplate text="Panel header" onClick={vm.headerClick} />
      </div>
      <div>
        <vm.props.bodyTemplate text={lorem} onClick={vm.bodyClick} />
      </div>
    </div>
  );
}

@ComponentBindings()
class PanelComponentProps {
  @Template() headerTemplate?: any;
  @Template() bodyTemplate?: any;
  @Event() onHeaderClick?: () => void;
  @Event() onBodyClick?: () => void;
}

@Component({
  view,
})
export default class PanelComponent extends JSXComponent(PanelComponentProps) {
  headerClick() {
    this.props.onHeaderClick();
  }

  bodyClick() {
    this.props.onBodyClick();
  }
}
