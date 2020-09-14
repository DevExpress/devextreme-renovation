import {
  Component,
  Ref,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
} from "../../../../component_declaration/common";

function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef as any}>
      <div ref={viewModel.props.outerDivRef as any}></div>
    </div>
  );
}

@ComponentBindings()
class WidgetProps {
  @ForwardRef() outerDivRef?: HTMLDivElement;

  @Ref() refProp!: HTMLDivElement;
  @ForwardRef() forwardRefProp!: HTMLDivElement;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<
  WidgetProps,
  "refProp" | "forwardRefProp"
>(WidgetProps) {
  @Ref() divRef!: HTMLDivElement;

  @Ref() ref!: HTMLDivElement;
  @ForwardRef() forwardRef!: HTMLDivElement;

  writeRefs() {
    this.props.refProp = this.divRef;
    this.props.forwardRefProp = this.divRef;
    this.ref = this.divRef;
    this.forwardRef = this.divRef;
  }

  readRefs() {
    const outer_1 = this.props.refProp.outerHTML;
    const outer_2 = this.props.forwardRefProp.outerHTML;
    const outer_3 = this.ref.outerHTML;
    const outer_4 = this.forwardRef.outerHTML;
  }
}
