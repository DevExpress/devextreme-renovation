import {
  Component,
  OneWay,
  createContext,
  ComponentBindings,
  JSXComponent,
  Provider,
  Consumer,
} from "../../../../component_declaration/common";

function view(model: Widget): JSX.Element {
  return <span></span>;
}

const P1Context = createContext(5);

const GetterContext = createContext("default");

@ComponentBindings()
class Props {
  @OneWay() p1 = 10;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<Props>() {
  @Consumer(P1Context)
  contextConsumer!: number;

  @Provider(P1Context)
  provider: number = 10;

  get sum() {
    return this.provider + this.contextConsumer;
  }

  @Provider(GetterContext)
  get contextProvider() {
    return "provide";
  }
}
