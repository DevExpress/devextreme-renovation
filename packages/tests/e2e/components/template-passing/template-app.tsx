import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

import InterComponent from "./inter-component";
import { HeaderComponent } from "./header-component";
import BodyComponent from "./body-component";
import TemplateParent from "./template-as-template-prop-parent";

const CustomTemplate = () => {
  return <span>SecondTemplateText</span>;
};

function view(vm: TemplateApp) {
  return (
    <div>
      <InterComponent
        titleTemplate={HeaderComponent}
        contentTemplate={BodyComponent}
      />
      <TemplateParent secondTemplate={CustomTemplate}></TemplateParent>
    </div>
  );
}

@ComponentBindings()
class TemplateAppProps {}

@Component({
  view,
  jQuery: {register: true},
})
export default class TemplateApp extends JSXComponent(TemplateAppProps) {}
