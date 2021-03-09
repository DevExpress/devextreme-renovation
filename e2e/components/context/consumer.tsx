import {
  Component,
  ComponentBindings,
  JSXComponent,
  Consumer,
} from "../../../component_declaration/common";

import { SimpleContext } from "./context";

function view(model: ConsumerComponent) {
  return <span>Consumer Value: {model.contextConsumer}</span>;
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class ConsumerComponent extends JSXComponent(Props) {
  @Consumer(SimpleContext)
  contextConsumer: number = 1;
}
