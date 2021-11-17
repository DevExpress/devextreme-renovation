import {
  Component,
  ComponentBindings,
  JSXComponent,
  Consumer,
} from "@devextreme-generator/declarations";

import { SimpleContext } from "./context";

function view(model: ConsumerComponent) {
  return <span>Consumer Value: {model.contextConsumer}</span>;
}

@ComponentBindings()
class Props {}

@Component({
  view,
  jQuery: {register: true},
})
export default class ConsumerComponent extends JSXComponent(Props) {
  @Consumer(SimpleContext)
  contextConsumer: number = 1;
}
