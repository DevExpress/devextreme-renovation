function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef as any}>
      <div ref={viewModel.props.outerDivRef as any}></div>
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
import * as Preact from "preact";
import { RefObject } from "preact";
import { useCallback, useRef } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  divRef: any;
  ref?: any;
  forwardRef?: any;
  existingRef: any;
  existingForwardRef: any;
  writeRefs: () => any;
  readRefs: () => any;
  getRestRefs: () => {
    refProp?: HTMLDivElement;
    forwardRefProp?: HTMLDivElement;
    requiredRefProp: HTMLDivElement;
    requiredForwardRefProp: HTMLDivElement;
  };
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __divRef = useRef<HTMLDivElement>();
  const __ref = useRef<HTMLDivElement>();
  const __existingRef = useRef<HTMLDivElement>();
  const __forwardRef = useRef<HTMLDivElement>();
  const __existingForwardRef = useRef<HTMLDivElement>();

  const __writeRefs = useCallback(
    function __writeRefs(): any {
      let someRef;
      if (props.refProp?.current!) {
      }
      someRef = props.refProp?.current!
        ? props.refProp?.current!
        : __divRef.current!;
      if (props.forwardRefProp) {
        props.forwardRefProp.current = __divRef.current!;
      }
      props.forwardRefProp &&
        (props.forwardRefProp.current = __divRef.current!);
      someRef = props.forwardRefProp?.current!
        ? props.forwardRefProp?.current!
        : __divRef.current!;
      if (!__ref.current!) {
        __ref.current = __divRef.current!;
      }
      !__ref.current! && (__ref.current = __divRef.current!);
      someRef = __ref.current! ? __ref.current! : __divRef.current!;
      if (!__forwardRef.current!) {
      }
      if (props.forwardRefProp) {
        props.forwardRefProp.current = __divRef.current!;
      }
      someRef = __forwardRef.current!
        ? __forwardRef.current!
        : __divRef.current!;
      __existingRef.current = __divRef.current!;
      props.requiredForwardRefProp.current = __divRef.current!;
    },
    [
      props.refProp?.current,
      props.forwardRefProp?.current,
      __ref.current,
      __forwardRef.current,
    ]
  );
  const __readRefs = useCallback(
    function __readRefs(): any {
      const outer_1 = props.refProp?.current?.outerHTML;
      const outer_2 = props.forwardRefProp?.current?.outerHTML;
      const outer_3 = __ref.current?.outerHTML;
      const outer_4 = __forwardRef.current?.outerHTML;
      const outer_5 = __existingRef.current!.outerHTML;
      const outer_6 = __existingForwardRef.current!.outerHTML;
      const outer_7 = props.requiredRefProp!.current!.outerHTML;
      const outer_8 = props.requiredForwardRefProp!.current!.outerHTML;
    },
    [
      props.refProp?.current,
      props.forwardRefProp?.current,
      __ref.current,
      __forwardRef.current,
    ]
  );
  const __getRestRefs = useCallback(
    function __getRestRefs(): {
      refProp?: HTMLDivElement;
      forwardRefProp?: HTMLDivElement;
      requiredRefProp: HTMLDivElement;
      requiredForwardRefProp: HTMLDivElement;
    } {
      const { outerDivRef, ...restProps } = {
        ...props,
        outerDivRef: props.outerDivRef?.current!,
        refProp: props.refProp?.current!,
        forwardRefProp: props.forwardRefProp?.current!,
        requiredRefProp: props.requiredRefProp!.current!,
        requiredForwardRefProp: props.requiredForwardRefProp!.current!,
      };
      return restProps;
    },
    [props]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        forwardRefProp,
        outerDivRef,
        refProp,
        requiredForwardRefProp,
        requiredRefProp,
        ...restProps
      } = {
        ...props,
        outerDivRef: props.outerDivRef?.current!,
        refProp: props.refProp?.current!,
        forwardRefProp: props.forwardRefProp?.current!,
        requiredRefProp: props.requiredRefProp!.current!,
        requiredForwardRefProp: props.requiredForwardRefProp!.current!,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef: __divRef,
    ref: __ref,
    existingRef: __existingRef,
    forwardRef: __forwardRef,
    existingForwardRef: __existingForwardRef,
    writeRefs: __writeRefs,
    readRefs: __readRefs,
    getRestRefs: __getRestRefs,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
