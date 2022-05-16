import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <div ref={viewModel.props.outerDivRef}></div>
    </div>
  );
}

interface WidgetPropsType {
  outerDivRef?: MutableRefObject<HTMLDivElement | null>;
  refProp?: MutableRefObject<HTMLDivElement | null>;
  forwardRefProp?: MutableRefObject<HTMLDivElement | null>;
  requiredRefProp?: MutableRefObject<HTMLDivElement | null>;
  requiredForwardRefProp?: MutableRefObject<HTMLDivElement | null>;
}

const WidgetProps = {} as Partial<WidgetPropsType>;
import { useCallback, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetPropsModel = Required<
  Omit<
    GetPropsType<typeof WidgetProps>,
    'outerDivRef' | 'refProp' | 'forwardRefProp'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetProps>,
      'outerDivRef' | 'refProp' | 'forwardRefProp'
    >
  >;
interface Widget {
  props: WidgetPropsModel & RestProps;
  divRef: any;
  ref: any;
  forwardRef: any;
  existingRef: any;
  existingForwardRef: any;
  writeRefs: () => any;
  readRefs: () => any;
  getRestRefs: () => {
    refProp?: HTMLDivElement | null;
    forwardRefProp?: HTMLDivElement | null;
    requiredRefProp: HTMLDivElement | null;
    requiredForwardRefProp: HTMLDivElement | null;
  };
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsModel>(WidgetProps, inProps);
  const __divRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const __ref: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const __existingRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const __forwardRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const __existingForwardRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const __writeRefs = useCallback(
    function __writeRefs(): any {
      let someRef;
      if (props.refProp) {
        someRef = props.refProp.current;
      }
      if (props.refProp?.current) {
        someRef = props.refProp.current;
      }
      if (props.forwardRefProp) {
        someRef = props.forwardRefProp.current;
      }
      if (props.forwardRefProp?.current) {
        someRef = props.forwardRefProp.current;
      }
      someRef = props.outerDivRef!.current;
      if (props.forwardRefProp && !props.forwardRefProp.current) {
        props.forwardRefProp.current = __divRef!.current;
      }
    },
    [props.refProp, props.forwardRefProp, props.outerDivRef]
  );
  const __readRefs = useCallback(
    function __readRefs(): any {
      const outer_1 = props.refProp?.current?.outerHTML;
      const outer_2 = props.forwardRefProp?.current?.outerHTML;
      const outer_3 = __ref?.current?.outerHTML;
      const outer_4 = __forwardRef?.current?.outerHTML;
      const outer_5 = __existingRef.current?.outerHTML;
      const outer_6 = __existingForwardRef.current?.outerHTML;
      const outer_7 = props.requiredRefProp.current?.outerHTML;
      const outer_8 = props.requiredForwardRefProp.current?.outerHTML;
    },
    [props.refProp, props.forwardRefProp]
  );
  const __getRestRefs = useCallback(
    function __getRestRefs(): {
      refProp?: HTMLDivElement | null;
      forwardRefProp?: HTMLDivElement | null;
      requiredRefProp: HTMLDivElement | null;
      requiredForwardRefProp: HTMLDivElement | null;
    } {
      const { outerDivRef, ...restProps } = props;
      return {
        refProp: restProps.refProp?.current,
        forwardRefProp: restProps.forwardRefProp?.current,
        requiredRefProp: restProps.requiredRefProp.current,
        requiredForwardRefProp: restProps.requiredForwardRefProp.current,
      };
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
      } = props;
      return restProps as RestProps;
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
