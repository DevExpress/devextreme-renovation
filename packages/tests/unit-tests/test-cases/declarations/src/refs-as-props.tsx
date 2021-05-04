import {
  Component,
  Ref,
  JSXComponent,
  ComponentBindings,
  RefObject,
} from "@devextreme-generator/declarations";
import WidgetWithRefProp from "./dx-widget-with-ref-prop";

function view(viewModel: Widget):JSX.Element|null {
  return (
    <div ref={viewModel.divRef}>
      <WidgetWithRefProp
        parentRef={viewModel.divRef}
        nullableRef={viewModel.props.nullableRef}
      />
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @Ref() nullableRef?: RefObject<HTMLDivElement>;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() divRef!: RefObject<HTMLDivElement>;

  getDirectly() {
    const divRefOuter = this.divRef.current?.outerHTML ?? "";
    const nullableRefOuter = this.props.nullableRef?.current?.outerHTML ?? "";
    return divRefOuter + nullableRefOuter;
  }

  getDestructed() {
    const { divRef } = this;
    const { nullableRef } = this.props;
    const divRefOuter = divRef.current?.outerHTML ?? "";
    const nullableRefOuter = nullableRef?.current?.outerHTML ?? "";
    return divRefOuter + nullableRefOuter;
  }
}
