import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
  OneWay,
} from "../../../component_declaration/common";

import { SimpleContext } from "./context";
import ConsumerComponent from "./consumer";

function view(model: GetterProvider) {
  return (
    <div>
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
})
export default class GetterProvider extends JSXComponent(Props) {
  @Provider(SimpleContext)
  get provide() {
    return this.props.p;
  }
}
