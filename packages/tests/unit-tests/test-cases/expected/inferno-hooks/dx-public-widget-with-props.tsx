import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view({ props: { optionalValue, value } }: PublicWidgetWithProps) {
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
import {
  useCallback,
  useImperativeHandle,
  InfernoWrapperComponent,
  useReRenderEffect,
} from '@devextreme/runtime/inferno-hooks';
import { forwardRef } from 'inferno';

export type PublicWidgetWithPropsRef = { doSomething: () => any };
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
interface PublicWidgetWithProps {
  props: WidgetWithPropsInputModel & RestProps;
  restAttributes: RestProps;
}

const PublicWidgetWithProps = (ref: any) =>
  function publicWidgetWithProps(
    inProps: typeof WidgetWithPropsInput & RestProps
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
  } as React.FC<
    typeof WidgetWithPropsInput &
      RestProps & { ref?: React.Ref<PublicWidgetWithPropsRef> }
  >;

let refs = new WeakMap();
const PublicWidgetWithPropsFn = (ref: any) => {
  if (!refs.has(ref)) {
    refs.set(ref, PublicWidgetWithProps(ref));
  }
  return refs.get(ref);
};
function createRerenderEffect(ref: any) {
  useReRenderEffect();
  PublicWidgetWithPropsFn(ref);
}
function HooksPublicWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref: any
) {
  return (
    <InfernoWrapperComponent
      renderFn={createRerenderEffect(ref)}
      renderProps={props}
    />
  );
}
const HooksPublicWidgetWithPropsFR = forwardRef(HooksPublicWidgetWithProps);

export { HooksPublicWidgetWithPropsFR };

export default HooksPublicWidgetWithPropsFR;
