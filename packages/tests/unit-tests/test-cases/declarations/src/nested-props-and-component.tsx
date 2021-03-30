import {
  Component,
  ComponentBindings,
  Nested,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

function view(model: undefWidget) {
  return (
    <div>
      <div>Nested: {model.nested}</div>
    </div>
  );
}
@ComponentBindings()
export class FakeNested {
  @OneWay() numberProp: number = 2;
}
@ComponentBindings()
export class WidgetProps {
  @Nested() nestedProp?: FakeNested[];
  @Nested() anotherNestedPropInit: FakeNested[] = [new FakeNested()];
}
@Component({ view })
export default class undefWidget extends JSXComponent(WidgetProps) {
  get nested() {
    return this.props.hasOwnProperty("nestedProp");
  }
  get nestedinit() {
    return this.props.hasOwnProperty("anotherNestedPropInit");
  }
}
