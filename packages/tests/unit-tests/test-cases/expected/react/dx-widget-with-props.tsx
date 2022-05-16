import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}

interface WidgetWithPropsInputType {
  value?: string;
  optionalValue?: string;
  number?: number;
  onClick?: (e: any) => void;
}
export const WidgetWithPropsInput = {
  value: 'default text',
  number: 42,
} as Partial<WidgetWithPropsInputType>;
import * as React from 'react';
import { useCallback, useImperativeHandle, forwardRef } from 'react';

export type WidgetWithPropsRef = { doSomething: () => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetWithPropsInputModel = Required<
  Omit<GetPropsType<typeof WidgetWithPropsInput>, 'optionalValue' | 'onClick'>
> &
  Partial<
    Pick<GetPropsType<typeof WidgetWithPropsInput>, 'optionalValue' | 'onClick'>
  >;
interface WidgetWithProps {
  props: WidgetWithPropsInputModel & RestProps;
  restAttributes: RestProps;
}
const WidgetWithProps = forwardRef<
  WidgetWithPropsRef,
  typeof WidgetWithPropsInput & RestProps
>(function widgetWithProps(
  inProps: typeof WidgetWithPropsInput & RestProps,
  ref
) {
  const props = combineWithDefaultProps<WidgetWithPropsInputModel>(
    WidgetWithPropsInput,
    inProps
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { number, onClick, optionalValue, value, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );
  const __doSomething = useCallback(function __doSomething(): any {}, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({ props: { ...props }, restAttributes: __restAttributes() });
}) as React.FC<
  typeof WidgetWithPropsInput &
    RestProps & { ref?: React.Ref<WidgetWithPropsRef> }
>;
export { WidgetWithProps };

export default WidgetWithProps;
