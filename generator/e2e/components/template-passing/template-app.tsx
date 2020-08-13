import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "../../../component_declaration/common";

import InterComponent from "./inter-component";
import { HeaderComponent } from "./header-component";
import BodyComponent from "./body-component";

function view(vm: TemplateApp) {
  return (
    <InterComponent
      titleTemplate={HeaderComponent}
      contentTemplate={BodyComponent}
    />
  );
}

@ComponentBindings()
class TemplateAppProps {}

@Component({
  view,
})
export default class TemplateApp extends JSXComponent(TemplateAppProps) {}
