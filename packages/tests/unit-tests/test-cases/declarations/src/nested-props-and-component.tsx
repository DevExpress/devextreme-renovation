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
    <div></div>
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
  @Event() someEvent?: () => void;
  @Ref() someRef?: RefObject;
  @ForwardRef() someForwardRef?: RefObject;
  @Slot() slotProp?: any;
  @Template() templateProp?: JSXTemplate;
  @Nested() nestedProp?: FakeNested[];
  @Nested() anotherNestedPropInit: FakeNested[] = [new FakeNested()];
}
@Component({ view })
export default class UndefWidget extends JSXComponent(WidgetProps) {
  get oneway() {
    return this.props.hasOwnProperty("oneWayProp");
  }
  get twoway() {
    return this.props.hasOwnProperty("twoWayProp");
  }
  get someevent() {
    return this.props.hasOwnProperty("someEvent");
  }
  get someref() {
    return this.props.hasOwnProperty("someRef");
  }
  get someforwardref() {
    return this.props.hasOwnProperty("someForwardRef");
  }
  get someslot() {
    return this.props.hasOwnProperty("slotProp");
  }
  get sometemplate(){
    return this.props.hasOwnProperty("templateProp")
  }
  get nested() {
    return this.props.hasOwnProperty("nestedProp");
  }
  get nestedinit() {
    return this.props.hasOwnProperty("anotherNestedPropInit");
  }
}
