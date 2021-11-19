import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
  OneWay,
} from "@devextreme-generator/declarations";

import { SimpleContext } from "./context";
import ConsumerComponent from "./consumer";

function view(model: GetterProvider) {
  return (
    <div id="context-getter-provider">
      <ConsumerComponent />
    </div>
  );
}

@ComponentBindings()
class Props {
  @OneWay() p = 0;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class GetterProvider extends JSXComponent(Props) {
  @Provider(SimpleContext)
  get provide() {
    return this.props.p;
  }
}
