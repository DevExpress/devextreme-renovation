import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
} from "../../../component_declaration/common";

import { SimpleContext } from "./context";

import ConsumerComponent from "./consumer";

function view(model: ProviderComponent) {
  return (
    <div>
      <ConsumerComponent />
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class ProviderComponent extends JSXComponent(Props) {
  @Provider(SimpleContext)
  context: number = 40;
}
