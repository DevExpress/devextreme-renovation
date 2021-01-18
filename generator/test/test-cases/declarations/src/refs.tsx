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

    if (this.ref && !this.ref.current) {
      this.ref.current = this.divRef.current;
    }
    this.ref && !this.ref.current && (this.ref!.current = this.divRef.current);
    someRef = this.ref?.current ? this.ref.current : this.divRef.current;

    if (this.forwardRef && !this.forwardRef.current) {
    }

    if (this.props.forwardRefProp) {
      this.props.forwardRefProp = this.divRef;
    }

    someRef = this.forwardRef ? this.forwardRef.current : this.divRef.current;

    this.existingRef.current = this.divRef.current;
    this.props.requiredForwardRefProp = this.divRef;
  }

  readRefs() {
    const outer_1 = this.props.refProp?.current?.outerHTML;
    const outer_2 = this.props.forwardRefProp?.current?.outerHTML;
    const outer_3 = this.ref?.current?.outerHTML;
    const outer_4 = this.forwardRef?.current?.outerHTML;
    const outer_5 = this.existingRef.current?.outerHTML;
    const outer_6 = this.existingForwardRef.current?.outerHTML;
    const outer_7 = this.props.requiredRefProp.current?.outerHTML;
    const outer_8 = this.props.requiredForwardRefProp.current?.outerHTML;
  }

  getRestRefs(): {
    refProp?: HTMLDivElement | null;
    forwardRefProp?: HTMLDivElement | null;
    requiredRefProp: HTMLDivElement | null;
    requiredForwardRefProp: HTMLDivElement | null;
  } {
    const { outerDivRef, ...restProps } = this.props;

    return {
      refProp: restProps.refProp?.current,
      forwardRefProp: restProps.forwardRefProp?.current,
      requiredRefProp: restProps.requiredRefProp.current,
      requiredForwardRefProp: restProps.requiredForwardRefProp.current,
    };
  }
}
