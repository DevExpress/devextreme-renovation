function view({ props: { optionalValue, value } }: PublicWidgetWithProps) {
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
  InfernoWrapperComponent,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type PublicWidgetWithPropsRef = { doSomething: () => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface PublicWidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

const ReactPublicWidgetWithProps = (
  props: typeof WidgetWithPropsInput & RestProps,
  ref: RefObject<PublicWidgetWithPropsRef>
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

HooksPublicWidgetWithProps.defaultProps = WidgetWithPropsInput;

function HooksPublicWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref: RefObject<PublicWidgetWithPropsRef>
) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactPublicWidgetWithProps}
      renderProps={props}
      renderRef={ref}
    />
  );
}
const PublicWidgetWithProps = forwardRef(HooksPublicWidgetWithProps);

export { PublicWidgetWithProps };

export default PublicWidgetWithProps;
