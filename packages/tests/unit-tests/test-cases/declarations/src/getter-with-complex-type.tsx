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
interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}
const SimpleContext = createContext<number>(5);

function view(viewModel: Widget) {
  return <div></div>;
}

@ComponentBindings()
export class Props {
  @OneWay() p: number = 10;
}

@Component({
  view: view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent<Props>() {
  internalField = 3
  @Mutable() mutableField = 3;
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

  someFunc(){
    return this.props.p
  }

  get g5(): number[] {
    return [this.someFunc(), this.g3, this.internalField, this.mutableField]
  }

  @Mutable()
  slidingWindowStateHolder!: SlidingWindowState;

  private get slidingWindowState(): SlidingWindowState {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return {
        indexesForReuse: [],
        slidingWindowIndexes: [],
      };
    }
    return slidingWindowState;
  }
}

class SomeClass {
  i = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
