function view(viewModel: Widget) {
  return (
    <div ref={viewModel.__divRef as any}>
      <div ref={viewModel.props.outerDivRef as any}></div>
    </div>
  );
}

export declare type WidgetPropsType = {
  outerDivRef?: MutableRefObject<HTMLDivElement>;
  refProp?: MutableRefObject<HTMLDivElement>;
  forwardRefProp?: MutableRefObject<HTMLDivElement>;
  requiredRefProp: MutableRefObject<HTMLDivElement>;
  requiredForwardRefProp: MutableRefObject<HTMLDivElement>;
};
const WidgetProps: WidgetPropsType = ({} as any) as WidgetPropsType;
import * as React from "react";
import { useCallback, useRef, MutableRefObject, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  __divRef: any;
  __ref?: any;
  __forwardRef?: any;
  __existingRef: any;
  __existingForwardRef: any;
  writeRefs: () => any;
  readRefs: () => any;
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
        forwardRefProp: props.forwardRefProp?.current!,
        requiredForwardRefProp: props.requiredForwardRefProp!.current!,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    __divRef,
    __ref,
    __existingRef,
    __forwardRef,
    __existingForwardRef,
    writeRefs: __writeRefs,
    readRefs: __readRefs,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
