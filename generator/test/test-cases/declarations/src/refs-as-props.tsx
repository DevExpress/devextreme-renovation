import {
  Component,
  Ref,
  JSXComponent,
  ComponentBindings,
  RefObject,
} from "../../../../component_declaration/common";
import WidgetWithRefProp from "./dx-widget-with-ref-prop";

function view(viewModel: Widget) {
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

  getSize() {
    return this.divRef.outerHTML + this.props.nullableRef?.outerHTML;
  }

  getNullable() {
    const { nullableRef } = this.props;
    return nullableRef?.outerHTML;
  }
}
