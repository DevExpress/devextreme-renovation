function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <div ref={viewModel.props.outerDivRef}></div>
    </div>
  );
}

export declare type WidgetPropsType = {
  outerDivRef?: RefObject<HTMLDivElement>;
  refProp?: RefObject<HTMLDivElement>;
  forwardRefProp?: RefObject<HTMLDivElement>;
  requiredRefProp: RefObject<HTMLDivElement>;
  requiredForwardRefProp: RefObject<HTMLDivElement>;
};
const WidgetProps: WidgetPropsType = ({} as any) as WidgetPropsType;
import {
  Component as InfernoComponent,
  createRef as infernoCreateRef,
  RefObject,
} from "inferno";
import { createElement as h } from "inferno-create-element";
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
  divRef = infernoCreateRef<HTMLDivElement>();
  ref = infernoCreateRef<HTMLDivElement>();
  forwardRef = infernoCreateRef<HTMLDivElement>();
  existingRef = infernoCreateRef<HTMLDivElement>();
  existingForwardRef = infernoCreateRef<HTMLDivElement>();

  constructor(props: typeof WidgetProps & RestProps) {
    super(props);

    this.writeRefs = this.writeRefs.bind(this);
    this.readRefs = this.readRefs.bind(this);
    this.getRestRefs = this.getRestRefs.bind(this);
  }

  writeRefs(): any {
    let someRef;
    if (this.props.refProp?.current!) {
    }
    someRef = this.props.refProp?.current!
      ? this.props.refProp?.current!
      : this.divRef.current!;
    if (this.props.forwardRefProp) {
      this.props.forwardRefProp.current = this.divRef.current!;
    }
    this.props.forwardRefProp &&
      (this.props.forwardRefProp.current = this.divRef.current!);
    someRef = this.props.forwardRefProp?.current!
      ? this.props.forwardRefProp?.current!
      : this.divRef.current!;
    if (!this.ref.current!) {
      this.ref.current = this.divRef.current!;
    }
    !this.ref.current! && (this.ref.current = this.divRef.current!);
    someRef = this.ref.current! ? this.ref.current! : this.divRef.current!;
    if (!this.forwardRef.current!) {
    }
    if (this.props.forwardRefProp) {
      this.props.forwardRefProp.current = this.divRef.current!;
    }
    someRef = this.forwardRef.current!
      ? this.forwardRef.current!
      : this.divRef.current!;
    this.existingRef.current = this.divRef.current!;
    this.props.requiredForwardRefProp.current = this.divRef.current!;
  }
  readRefs(): any {
    const outer_1 = this.props.refProp?.current?.outerHTML;
    const outer_2 = this.props.forwardRefProp?.current?.outerHTML;
    const outer_3 = this.ref.current?.outerHTML;
    const outer_4 = this.forwardRef.current?.outerHTML;
    const outer_5 = this.existingRef.current!.outerHTML;
    const outer_6 = this.existingForwardRef.current!.outerHTML;
    const outer_7 = this.props.requiredRefProp!.current!.outerHTML;
    const outer_8 = this.props.requiredForwardRefProp!.current!.outerHTML;
  }
  getRestRefs(): {
    refProp?: HTMLDivElement;
    forwardRefProp?: HTMLDivElement;
    requiredRefProp: HTMLDivElement;
    requiredForwardRefProp: HTMLDivElement;
  } {
    const { outerDivRef, ...restProps } = {
      ...this.props,
      outerDivRef: this.props.outerDivRef?.current!,
      refProp: this.props.refProp?.current!,
      forwardRefProp: this.props.forwardRefProp?.current!,
      requiredRefProp: this.props.requiredRefProp!.current!,
      requiredForwardRefProp: this.props.requiredForwardRefProp!.current!,
    };
    return restProps;
  }
  get restAttributes(): RestProps {
    const {
      forwardRefProp,
      outerDivRef,
      refProp,
      requiredForwardRefProp,
      requiredRefProp,
      ...restProps
    } = {
      ...this.props,
      outerDivRef: this.props.outerDivRef?.current!,
      refProp: this.props.refProp?.current!,
      forwardRefProp: this.props.forwardRefProp?.current!,
      requiredRefProp: this.props.requiredRefProp!.current!,
      requiredForwardRefProp: this.props.requiredForwardRefProp!.current!,
    };
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
