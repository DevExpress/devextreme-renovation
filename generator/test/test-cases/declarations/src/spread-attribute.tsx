import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  OneWay,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return (
    <div ref={model.host as any} {...model.attr1}>
      <input {...model.attr2} />
      <input ref={model.i1 as any} {...model.attr2} />
      <input {...model.props.prop} />
    </div>
  );
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() prop: any = {};
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() host?: HTMLDivElement;
  @Ref() i1!: HTMLInputElement;

  get attr1() {
    return {};
  }

  get attr2() {
    return {};
  }
}
