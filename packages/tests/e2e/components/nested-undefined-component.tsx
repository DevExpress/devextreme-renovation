import {
  Component,
  ComponentBindings,
  Nested,
  JSXComponent,
  OneWay,
  TwoWay,
  Event,
  Ref,
  RefObject,
  ForwardRef,
  Template,
  JSXTemplate,
  Slot,
} from "@devextreme-generator/declarations";

function view(model: UndefWidget) {
  return (
    <div>
      <div>
        OneWay: {`${model.oneway}`}
      </div>
      <div>TwoWay: {`${model.twoway}`}</div>
      <div>Ref: {`${model.someref}`}</div>
      <div>ForwardRef: {`${model.someforwardref}`}</div>
      <div>Nested: {`${model.nested}`}</div>
      <div>Nested with Init: {`${model.nestedinit}`}</div>
      <hr/>
    </div>
  );
}
@ComponentBindings()
export class FakeNested {
  @OneWay() numberProp: number = 2;
}
@ComponentBindings()
export class WidgetProps {
  @OneWay() oneWayProp?: number;
  @TwoWay() twoWayProp?: number;
  @Ref() someRef?: RefObject;
  @ForwardRef() someForwardRef?: RefObject;
  @Nested() nestedProp?: FakeNested[];
  @Nested() anotherNestedPropInit: FakeNested[] = [new FakeNested()];
}
@Component({ 
  view,
  jQuery: {register: true}, 
})
export default class UndefWidget extends JSXComponent(WidgetProps) {
  get oneway() {
    return this.props.hasOwnProperty("oneWayProp");
  }
  get twoway() {
    return this.props.hasOwnProperty("twoWayProp");
  }
  get someref() {
    return this.props.hasOwnProperty("someRef");
  }
  get someforwardref() {
    return this.props.hasOwnProperty("someForwardRef");
  }
  get nested() {
    return this.props.hasOwnProperty("nestedProp");
  }
  get nestedinit() {
    return this.props.hasOwnProperty("anotherNestedPropInit");
  }
}
