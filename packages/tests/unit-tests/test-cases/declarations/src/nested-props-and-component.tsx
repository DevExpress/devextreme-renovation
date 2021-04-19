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
  Effect,
  Template,
  JSXTemplate,
  Slot,
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
  @OneWay() someProp?: number;
  // @TwoWay() twoWayProp: number = 2;
  // @Event() someEvent?: () => void;
  // @Ref() someRef?: RefObject;
  // @ForwardRef() someForwardRef?: RefObject;

  @Slot() slotProp?: any;
  @Template() templateProp?: JSXTemplate;
  // @Effect() someEffect?: () => void;
  @Nested() nestedProp?: FakeNested[];
  @Nested() anotherNestedPropInit: FakeNested[] = [new FakeNested()];
}
@Component({ view })
export default class undefWidget extends JSXComponent(WidgetProps) {
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
