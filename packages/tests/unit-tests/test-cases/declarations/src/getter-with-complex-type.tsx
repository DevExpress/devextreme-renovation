import {
  Component,
  OneWay,
  ComponentBindings,
  InternalState,
  JSXComponent,
  Provider,
  createContext,
  Consumer,
  Mutable
} from "@devextreme-generator/declarations";

const SimpleContext = createContext<number>(5);

function view(viewModel: Widget) {
  return <div></div>;
}
type UserType = 'user'|'not';
@ComponentBindings()
export class Props {
  @OneWay() p: number = 10;
}

@Component({
  view: view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent<Props>() {
  @Mutable() mutableVar = 10;
  @InternalState() i: number = 10;
  @Provider(SimpleContext)
  get provide() {
    return this.i
  }
  @Consumer(SimpleContext)
  cons!: number;
  get g1(): number[] {
    return [this.props.p, this.i];
  }

  get g2(): number {
    return this.props.p;
  }

  get g3(): number {
    return this.i;
  }

  get g4(): number[] {
    return [this.cons]
  }

  get g5(): number[] {
    return [this.i, this.mutableVar]
  }

  get userGet(): UserType{
    return 'user'
  }
}

class SomeClass {
  i = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
