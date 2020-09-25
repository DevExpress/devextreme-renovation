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

  @Ref() refProp?: HTMLDivElement;
  @ForwardRef() forwardRefProp?: HTMLDivElement;

  @Ref() requiredRefProp!: HTMLDivElement;
  @ForwardRef() requiredForwardRefProp!: HTMLDivElement;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<
  WidgetProps,
  "requiredRefProp" | "requiredForwardRefProp"
>(WidgetProps) {
  @Ref() divRef!: HTMLDivElement;

  @Ref() ref?: HTMLDivElement;
  @ForwardRef() forwardRef?: HTMLDivElement;
  @Ref() existingRef!: HTMLDivElement;
  @ForwardRef() existingForwardRef!: HTMLDivElement;

  writeRefs() {
    let someRef;

    if (this.props.refProp) {
      this.props.refProp = this.divRef;
    }
    this.props.refProp && (this.props.refProp = this.divRef);
    someRef = this.props.refProp ? this.props.refProp : this.divRef;

    if (this.props.forwardRefProp) {
      this.props.forwardRefProp = this.divRef;
    }
    this.props.forwardRefProp && (this.props.forwardRefProp = this.divRef);
    someRef = this.props.forwardRefProp
      ? this.props.forwardRefProp
      : this.divRef;

    if (this.ref) {
      this.ref = this.divRef;
    }
    this.ref && (this.ref = this.divRef);
    someRef = this.ref ? this.ref : this.divRef;

    if (this.forwardRef) {
      this.forwardRef = this.divRef;
    }
    this.forwardRef && (this.forwardRef = this.divRef);
    someRef = this.forwardRef ? this.forwardRef : this.divRef;

    this.existingRef = this.divRef;
    this.existingForwardRef = this.divRef;
    this.props.requiredRefProp = this.divRef;
    this.props.requiredForwardRefProp = this.divRef;
  }

  readRefs() {
    const outer_1 = this.props.refProp?.outerHTML;
    const outer_2 = this.props.forwardRefProp?.outerHTML;
    const outer_3 = this.ref?.outerHTML;
    const outer_4 = this.forwardRef?.outerHTML;
    const outer_5 = this.existingRef.outerHTML;
    const outer_6 = this.existingForwardRef.outerHTML;
    const outer_7 = this.props.requiredRefProp.outerHTML;
    const outer_8 = this.props.requiredForwardRefProp.outerHTML;
  }
}
