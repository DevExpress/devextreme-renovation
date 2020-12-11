import {
  Component,
  Ref,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  RefObject,
} from "../../../../component_declaration/common";

function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <div ref={viewModel.props.outerDivRef}></div>
    </div>
  );
}

@ComponentBindings()
class WidgetProps {
  @ForwardRef() outerDivRef?: RefObject<HTMLDivElement>;

  @Ref() refProp?: RefObject<HTMLDivElement>;
  @ForwardRef() forwardRefProp?: RefObject<HTMLDivElement>;

  @Ref() requiredRefProp!: RefObject<HTMLDivElement>;
  @ForwardRef() requiredForwardRefProp!: RefObject<HTMLDivElement>;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<
  WidgetProps,
  "requiredRefProp" | "requiredForwardRefProp"
>(WidgetProps) {
  @Ref() divRef!: RefObject<HTMLDivElement>;

  @Ref() ref?: RefObject<HTMLDivElement>;
  @ForwardRef() forwardRef?: RefObject<HTMLDivElement>;
  @Ref() existingRef!: RefObject<HTMLDivElement>;
  @ForwardRef() existingForwardRef!: RefObject<HTMLDivElement>;

  writeRefs() {
    let someRef;

    if (this.props.refProp) {
    }
    someRef = this.props.refProp ? this.props.refProp : this.divRef;

    if (this.props.forwardRefProp) {
      this.props.forwardRefProp = this.divRef;
    }
    this.props.forwardRefProp && (this.props.forwardRefProp = this.divRef);
    someRef = this.props.forwardRefProp
      ? this.props.forwardRefProp
      : this.divRef;

    if (!this.ref) {
      this.ref = this.divRef;
    }
    !this.ref && (this.ref = this.divRef);
    someRef = this.ref ? this.ref : this.divRef;

    if (!this.forwardRef) {
    }

    if (this.props.forwardRefProp) {
      this.props.forwardRefProp = this.divRef;
    }

    someRef = this.forwardRef ? this.forwardRef : this.divRef;

    this.existingRef = this.divRef;
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

  getRestRefs(): {
    refProp?: HTMLDivElement;
    forwardRefProp?: HTMLDivElement;
    requiredRefProp: HTMLDivElement;
    requiredForwardRefProp: HTMLDivElement;
  } {
    const { outerDivRef, ...restProps } = this.props;

    return restProps;
  }
}
