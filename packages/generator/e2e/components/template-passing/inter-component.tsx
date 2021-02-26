import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  Template,
  InternalState,
} from "../../../component_declaration/common";

import PanelComponent from "./panel-component";

function view({
  props: { titleTemplate, contentTemplate },
  clicks,
  headerClick,
  bodyClick,
}: InterComponent) {
  return (
    <Fragment>
      <div id="template-app-clicks">{clicks}</div>
      <PanelComponent
        headerTemplate={titleTemplate}
        bodyTemplate={contentTemplate}
        onHeaderClick={headerClick}
        onBodyClick={bodyClick}
      />
    </Fragment>
  );
}

@ComponentBindings()
class InterComponentProps {
  @Template() titleTemplate?: any;
  @Template() contentTemplate?: any;
}

@Component({
  view,
})
export default class InterComponent extends JSXComponent(InterComponentProps) {
  @InternalState() clicks = "";
  headerClick() {
    this.log("header");
  }

  bodyClick() {
    this.log("body");
  }

  log(msg: string) {
    this.clicks = `${this.clicks}_${msg}`;
  }
}
