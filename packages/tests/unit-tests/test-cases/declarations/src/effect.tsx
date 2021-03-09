import {
  OneWay,
  TwoWay,
  Component,
  InternalState,
  Effect,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

function view(model: Widget) {
  return <div></div>;
}

function subscribe(p: string, s: number, i: number) {
  return 1;
}

function unsubscribe(id: number) {
  return undefined;
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() p: string = "10";
  @OneWay() r: string = "20";
  @TwoWay() s: number = 10;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() i: number = 10;
  @InternalState() j: number = 20;
  @Effect()
  setupData() {
    const id = subscribe(this.getP(), this.props.s, this.i);
    this.i = 15;
    return () => unsubscribe(id);
  }

  @Effect({ run: "once" })
  onceEffect() {
    const id = subscribe(this.getP(), this.props.s, this.i);
    this.i = 15;
    return () => unsubscribe(id);
  }

  @Effect({ run: "always" })
  alwaysEffect() {
    const id = subscribe(this.getP(), 1, 2);
    return () => unsubscribe(id);
  }

  getP() {
    return this.props.p;
  }
}
