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
} from '@devextreme/runtime/inferno-hooks';
import { forwardRef } from 'inferno';

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

let refs = new Map();
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
  );
}
const HooksWidgetWithPropsFR = forwardRef(HooksWidgetWithProps);

export { HooksWidgetWithPropsFR };

export default HooksWidgetWithPropsFR;
