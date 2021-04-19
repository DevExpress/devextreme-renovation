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
        OneWay: {model.someprop} | {model.props.someProp}
      </div>
      <div>Nested: {model.nested}</div>
      <div>Nested with Init: {model.nestedinit}</div>
    </div>
  );
}
@ComponentBindings()
export class FakeNested {
  @OneWay() numberProp: number = 2;
}
@ComponentBindings()
export class WidgetProps {
  @OneWay() someProp?: number = 2;
  @TwoWay() twoWayProp: number = 2;
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
  get someprop() {
    return this.props.hasOwnProperty("someProp");
  }
  get nested() {
    return this.props.hasOwnProperty("nestedProp");
  }
  get nestedinit() {
    return this.props.hasOwnProperty("anotherNestedPropInit");
  }
}
