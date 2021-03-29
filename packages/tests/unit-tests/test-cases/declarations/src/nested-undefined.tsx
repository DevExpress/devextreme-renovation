import {
  Component,
  ComponentBindings,
  OneWay,
  TwoWay,
  Nested,
  Ref,
  Template,
  JSXTemplate,
  JSXComponent,
  ForwardRef,
  RefObject,
  Event,
  Slot,
} from "@devextreme-generator/declarations";

function view(model: undefWidget) {
  return (
    <div>
      <div>OneWay: {model.oneway}</div>
    </div>
  );
}
@ComponentBindings()
export class FakeNested {
  @OneWay() sas: number = 2;
}
@ComponentBindings()
export class WidgetProps {
  @OneWay() oneWayProp?: Number;
  @TwoWay() twoWayProp?: number;
  @Nested() nestedProp?: FakeNested[];
  @Ref() refProp?: RefObject;
  @ForwardRef() forwardRefProp?: RefObject;
  @Template() templateProp?: JSXTemplate;
  @Event() onSomething?: (a: number) => void;
  @Slot() childrenSlot?: any;
  @OneWay() oneWayPropInit: number = 2;
  @Nested() nestedPropInit?: FakeNested[] = [new FakeNested()];
}
@Component({ view })
export default class undefWidget extends JSXComponent(WidgetProps) {
  get oneway() {
    return this.props.hasOwnProperty("oneWayProp");
  }
  get nested() {
    return this.props.hasOwnProperty("nestedProp");
  }
  get onewayinit() {
    return this.props.hasOwnProperty("oneWayPropInit");
  }
  get nestedinit() {
    return this.props.hasOwnProperty("nestedPropInit");
  }
}
