import {
  OneWay,
  TwoWay,
  Component,
  InternalState,
  Effect,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() myArray: Array<string> = [];
  @OneWay() myObject: object = {};
  @OneWay() mySimple: string = "";
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() internalArray: string[] = [];
  @InternalState() internalObject: object = {};
  @InternalState() internalSimple: string = "";
  counter: number = 0;

  @Effect()
  effect() {}

  @Effect()
  effectWithObservables() {
    const { myArray } = this.props;
    const { internalArray, counter } = this;
    this.counter = myArray.length + internalArray.length + counter;
  }

  @Effect({ run: "once" })
  onceEffect() {}

  @Effect({ run: "always" })
  alwaysEffect() {}

  myMethod() {}
}
