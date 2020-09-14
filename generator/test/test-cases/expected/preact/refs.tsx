function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef as any}>
      <div ref={viewModel.props.outerDivRef as any}></div>
    </div>
  );
}

export declare type WidgetPropsType = {
  outerDivRef?: RefObject<HTMLDivElement>;
  refProp: RefObject<HTMLDivElement>;
  forwardRefProp: RefObject<HTMLDivElement>;
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
  ref: any;
  forwardRef: any;
  writeRefs: () => any;
  readRefs: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const divRef = useRef<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>();
  const forwardRef = useRef<HTMLDivElement>();

  const __writeRefs = useCallback(function __writeRefs(): any {
    props.refProp!.current = divRef.current!;
    props.forwardRefProp!.current = divRef.current!;
    ref.current = divRef.current!;
    forwardRef.current = divRef.current!;
  }, []);
  const __readRefs = useCallback(function __readRefs(): any {
    const outer_1 = props.refProp!.current!.outerHTML;
    const outer_2 = props.forwardRefProp!.current!.outerHTML;
    const outer_3 = ref.current!.outerHTML;
    const outer_4 = forwardRef.current!.outerHTML;
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { forwardRefProp, outerDivRef, refProp, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef,
    ref,
    forwardRef,
    writeRefs: __writeRefs,
    readRefs: __readRefs,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
