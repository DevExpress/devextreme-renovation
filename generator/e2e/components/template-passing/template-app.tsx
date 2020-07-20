import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "../../../component_declaration/common";

import InterComponent from "./inter-component.tsx";
import HeaderComponent from "./header-component.tsx";
import BodyComponent from "./body-component.tsx";

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
