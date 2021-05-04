import {
  OneWay,
  TwoWay,
  Component,
  InternalState,
  Effect,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget) :JSX.Element|null {
  return <div></div>;
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() propArray: Array<string> = [];
  @OneWay() propObject: object = {};
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() internalArray: string[] = [];
  @InternalState() internalObject: object = {};
  @InternalState() keys: string[] = [];
  @InternalState() counter: number = 0;

  @Effect()
  effect() {
    const { propObject } = this.props;
    const { internalObject } = this;
    this.keys = Object.keys(propObject).concat(Object.keys(internalObject));
  }

  @Effect()
  effectWithObservables() {
    const { propArray } = this.props;
    const { internalArray } = this;
    this.counter = propArray.length + internalArray.length;
  }

  @Effect({ run: "once" })
  onceEffect() {}

  @Effect({ run: "always" })
  alwaysEffect() {}

  myMethod() {}
}
