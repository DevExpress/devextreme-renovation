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
  HookContainer,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type WidgetWithPropsRef = { doSomething: () => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface WidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

const ReactWidgetWithProps = (
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
  const __doSomething = useCallback(function __doSomething(): any {}, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({ props: { ...props }, restAttributes: __restAttributes() });
};

HooksWidgetWithProps.defaultProps = WidgetWithPropsInput;

function HooksWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref: RefObject<WidgetWithPropsRef>
) {
  return (
    <HookContainer
      renderFn={ReactWidgetWithProps}
      renderProps={props}
      renderRef={ref}
    />
  );
}
const WidgetWithProps = forwardRef(HooksWidgetWithProps);

export { WidgetWithProps };

export default WidgetWithProps;
