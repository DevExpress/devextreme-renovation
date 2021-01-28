import { RefObject } from "../../../../modules/inferno/ref_object";
import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <div ref={viewModel.props.outerDivRef}></div>
    </div>
  );
}

export declare type WidgetPropsType = {
  outerDivRef?: any;
  refProp?: any;
  forwardRefProp?: any;
  requiredRefProp: any;
  requiredForwardRefProp: any;
};
const WidgetProps: WidgetPropsType = ({} as any) as WidgetPropsType;
import { createElement as h } from "inferno-compat";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetProps & RestProps
> {
  state = {};
  refs: any;
  divRef: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();
  ref: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();
  forwardRef: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();
  existingRef: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();
  existingForwardRef: RefObject<HTMLDivElement> = infernoCreateRef<
    HTMLDivElement
  >();

  constructor(props: typeof WidgetProps & RestProps) {
    super(props);

    this.writeRefs = this.writeRefs.bind(this);
    this.readRefs = this.readRefs.bind(this);
    this.getRestRefs = this.getRestRefs.bind(this);
  }

  writeRefs(): any {
    let someRef;
    if (this.props.refProp) {
    }
    if (this.props.refProp?.current) {
    }
    if (this.props.forwardRefProp) {
    }
    if (this.props.forwardRefProp?.current) {
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
    this.ref && !this.ref.current && (this.ref.current = this.divRef.current);
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
  readRefs(): any {
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
  get restAttributes(): RestProps {
    const {
      forwardRefProp,
      outerDivRef,
      refProp,
      requiredForwardRefProp,
      requiredRefProp,
      ...restProps
    } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      divRef: this.divRef,
      ref: this.ref,
      existingRef: this.existingRef,
      forwardRef: this.forwardRef,
      existingForwardRef: this.existingForwardRef,
      writeRefs: this.writeRefs,
      readRefs: this.readRefs,
      getRestRefs: this.getRestRefs,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetProps,
};
