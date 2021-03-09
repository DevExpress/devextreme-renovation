import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  TwoWay,
  Slot,
  Template,
  Ref,
  Method,
  RefObject,
} from "@devextreme-generator/declaration";
import AnotherWidget from "./method";

function view(model: MetaWidget) {
  return null;
}

@ComponentBindings()
class MetaWidgetInput {
  @OneWay() oneWayProp1?: any;
  @OneWay() oneWayProp2?: any;
  @TwoWay() twoWayProp1?: any;
  @TwoWay() twoWayProp2?: any;
  @Slot() slotProp1?: any;
  @Slot() slotProp2?: any;
  @Template() templateProp1?: any;
  @Template() templateProp2?: any;
  @Event() eventProp1?: any;
  @Event() eventProp2?: any;
  @Ref() refProp1?: RefObject;
  @Ref() refProp2?: RefObject;
}

@Component({
  view: view,
  jQuery: {
    register: true,
  },
})
export default class MetaWidget extends JSXComponent(MetaWidgetInput) {
  @Ref()
  baseRef?: RefObject<AnotherWidget>;

  @Method()
  apiMethod1() {
    return this.baseRef?.current?.getHeight(1, 1);
  }

  @Method()
  apiMethod2() {
    return this.baseRef?.current?.getHeight(1, 1);
  }
}
