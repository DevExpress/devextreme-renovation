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
  const divRef = useRef<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>();
  const existingRef = useRef<HTMLDivElement>();
  const forwardRef = useRef<HTMLDivElement>();
  const existingForwardRef = useRef<HTMLDivElement>();

  const __writeRefs = useCallback(
    function __writeRefs(): any {
      let someRef;
      if (props.refProp?.current!) {
      }
      someRef = props.refProp?.current!
        ? props.refProp?.current!
        : divRef.current!;
      if (props.forwardRefProp) {
        props.forwardRefProp.current = divRef.current!;
      }
      props.forwardRefProp && (props.forwardRefProp.current = divRef.current!);
      someRef = props.forwardRefProp?.current!
        ? props.forwardRefProp?.current!
        : divRef.current!;
      if (!ref.current!) {
        ref.current = divRef.current!;
      }
      !ref.current! && (ref.current = divRef.current!);
      someRef = ref.current! ? ref.current! : divRef.current!;
      if (!forwardRef.current!) {
      }
      if (props.forwardRefProp) {
        props.forwardRefProp.current = divRef.current!;
      }
      someRef = forwardRef.current! ? forwardRef.current! : divRef.current!;
      existingRef.current = divRef.current!;
      props.requiredForwardRefProp.current = divRef.current!;
    },
    [
      props.refProp?.current,
      props.forwardRefProp?.current,
      ref.current,
      forwardRef.current,
    ]
  );
  const __readRefs = useCallback(
    function __readRefs(): any {
      const outer_1 = props.refProp?.current?.outerHTML;
      const outer_2 = props.forwardRefProp?.current?.outerHTML;
      const outer_3 = ref.current?.outerHTML;
      const outer_4 = forwardRef.current?.outerHTML;
      const outer_5 = existingRef.current!.outerHTML;
      const outer_6 = existingForwardRef.current!.outerHTML;
      const outer_7 = props.requiredRefProp!.current!.outerHTML;
      const outer_8 = props.requiredForwardRefProp!.current!.outerHTML;
    },
    [
      props.refProp?.current,
      props.forwardRefProp?.current,
      ref.current,
      forwardRef.current,
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
    divRef,
    ref,
    existingRef,
    forwardRef,
    existingForwardRef,
    writeRefs: __writeRefs,
    readRefs: __readRefs,
    getRestRefs: __getRestRefs,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
