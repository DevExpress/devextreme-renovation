import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  OneWay,
  RefObject,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return (
    <div ref={model.host} {...model.attr1}>
      <input {...model.attr2} />
      <input ref={model.i1} {...model.attr2} />
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
  @Ref() host?: RefObject<HTMLDivElement>;
  @Ref() i1!: RefObject<HTMLInputElement>;

  get attr1() {
    return {};
  }

  get attr2() {
    return {};
  }
}
