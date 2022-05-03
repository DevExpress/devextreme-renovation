function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}

export type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
  number?: number;
  onClick?: (e: any) => void;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: 'default text',
  number: 42,
};
import {
  useCallback,
  useImperativeHandle,
  HookComponent,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type WidgetWithPropsRef = { doSomething: () => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

<<<<<<< HEAD
const WidgetWithProps = (
  props: typeof WidgetWithPropsInput & RestProps,
  ref: RefObject<WidgetWithPropsRef>
) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { number, onClick, optionalValue, value, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __doSomething = useCallback(function __doSomething(): any { }, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({ props: { ...props }, restAttributes: __restAttributes() });
};

WidgetWithProps.defaultProps = WidgetWithPropsInput;

function HooksWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref: RefObject<WidgetWithPropsRef>
) {
  return (
    <HookComponent
      renderFn={WidgetWithProps}
      renderProps={props}
      renderRef={ref}
    />
=======
const WidgetWithProps = (ref: any) =>
  function widgetWithProps(props: typeof WidgetWithPropsInput & RestProps) {
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { number, onClick, optionalValue, value, ...restProps } = props;
        return restProps;
      },
      [props]
    );
    const __doSomething = useCallback(function __doSomething(): any {}, []);

    useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
      __doSomething,
    ]);
    return view({ props: { ...props }, restAttributes: __restAttributes() });
  } as React.FC<
    typeof WidgetWithPropsInput &
      RestProps & { ref?: React.Ref<WidgetWithPropsRef> }
  > & { defaultProps: typeof WidgetWithPropsInput };

WidgetWithProps.defaultProps = WidgetWithPropsInput;

let refs = new WeakMap();
const WidgetWithPropsFn = (ref: any) => {
  if (!refs.has(ref)) {
    refs.set(ref, WidgetWithProps(ref));
  }
  return refs.get(ref);
};

function HooksWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref: any
) {
  return (
    <HookComponent renderFn={WidgetWithPropsFn(ref)} renderProps={props} />
>>>>>>> master
  );
}
const HooksWidgetWithPropsFR = forwardRef(HooksWidgetWithProps);

export { HooksWidgetWithPropsFR };

export default HooksWidgetWithPropsFR;
