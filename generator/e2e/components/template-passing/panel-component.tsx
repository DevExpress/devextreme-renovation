import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Template,
} from "../../../component_declaration/common";

const lorem =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis velit vero alias deserunt adipisci minima eum incidunt architecto, possimus delectus commodi similique tempore optio quaerat facere laborum eius iste perspiciatis!";

function view(vm: PanelComponent) {
  return (
    <div>
      <div>
        <span>Header:</span>
        <vm.props.headerTemplate
          text="Panel header"
          onClick={vm.headerClick}
        />{" "}
      </div>
      <div>
        <span>Body:</span>
        <vm.props.bodyTemplate text={lorem} onClick={vm.bodyClick} />{" "}
      </div>
    </div>
  );
}

@ComponentBindings()
class PanelComponentProps {
  @Template() headerTemplate?: any;
  @Template() bodyTemplate?: any;
  @Event() onHeaderClick?: () => void = () => void 0;
  @Event() onBodyClick?: () => void = () => void 0;
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
