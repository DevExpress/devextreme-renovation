import {
  Component,
  OneWay,
  createContext,
  ComponentBindings,
  JSXComponent,
  Provider,
  Consumer,
} from "@devextreme-generator/declarations";

function view(model: Widget): JSX.Element {
  return <span></span>;
}

const P1Context = createContext(5);

const ContextForConsumer = createContext(null);

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

  @Consumer(ContextForConsumer)
  consumer!: any;

  get sum() {
    return this.provider + this.contextConsumer;
  }

  @Provider(GetterContext)
  get contextProvider() {
    return "provide";
  }
}
