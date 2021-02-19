import {
  Component,
  JSXComponent,
  ComponentBindings,
  Mutable,
  Effect,
} from "../../../../component_declaration/common";

function view(viewModel: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Mutable() obj!: {
    value?: number;
  };
  @Mutable() notDefinedObj?: {
    value?: number;
  };
  @Mutable() definedObj: {
    value?: number;
  } = { value: 0 };

  setObj() {
    this.obj.value = 0;
    this.definedObj.value = 0;
    this.notDefinedObj = this.notDefinedObj || {};
    this.notDefinedObj.value = 0;
  }

  getValue() {
    const a: number = this.obj.value ?? 0;
    const b: number = this.notDefinedObj?.value ?? 0;
    const c: number = this.definedObj.value ?? 0;
    return a + b + c;
  }

  getObj() {
    return this.obj;
  }

  destruct() {
    const { obj, definedObj, notDefinedObj } = this;
    const a = obj.value;
    const b = definedObj.value;
    const c = notDefinedObj?.value;
  }

  @Effect()
  initialize() {
    this.setObj();
  }
}
