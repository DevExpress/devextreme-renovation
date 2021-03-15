import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
} from "@devextreme-generator/declaration";

import { SimpleContext } from "./context";

import ConsumerComponent from "./consumer";

function view(model: ProviderComponent) {
  return (
    <div>
      ProviderValue:{model.contextProvider}
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
  contextProvider: number = 40;
}