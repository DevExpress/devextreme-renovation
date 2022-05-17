import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
import BaseWidget from './method';
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

interface WidgetWithApiRefInputType {
  prop1?: number;
}

const WidgetWithApiRefInput = {} as Partial<WidgetWithApiRefInputType>;
import { WidgetRef as BaseWidgetRef } from './method';
import {
  useCallback,
  useRef,
  useImperativeHandle,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';
import { forwardRef } from 'inferno';

export type WidgetWithApiRefRef = { getSomething: () => string };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetWithApiRefInputModel = Required<
  Omit<GetPropsType<typeof WidgetWithApiRefInput>, 'prop1'>
> &
  Partial<Pick<GetPropsType<typeof WidgetWithApiRefInput>, 'prop1'>>;
interface WidgetWithApiRef {
  props: WidgetWithApiRefInputModel & RestProps;
  baseRef: any;
  restAttributes: RestProps;
}

const WidgetWithApiRef = (ref: any) =>
  function widgetWithApiRef(inProps: typeof WidgetWithApiRefInput & RestProps) {
    const props = combineWithDefaultProps<WidgetWithApiRefInputModel>(
      WidgetWithApiRefInput,
      inProps
    );
    const __baseRef: MutableRefObject<BaseWidgetRef | null> =
      useRef<BaseWidgetRef>(null);

    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { prop1, ...restProps } = props;
        return restProps as RestProps;
      },
      [props]
    );
    const __getSomething = useCallback(
      function __getSomething(): string {
        return `${props.prop1} + ${__baseRef?.current?.getHeight(
          1,
          undefined
        )}`;
      },
      [props.prop1]
    );

    useImperativeHandle(ref, () => ({ getSomething: __getSomething }), [
      __getSomething,
    ]);
    return view({
      props: { ...props },
      baseRef: __baseRef,
      restAttributes: __restAttributes(),
    });
  } as React.FC<
    typeof WidgetWithApiRefInput &
      RestProps & { ref?: React.Ref<WidgetWithApiRefRef> }
  >;

let refs = new WeakMap();
const WidgetWithApiRefFn = (ref: any) => {
  if (!refs.has(ref)) {
    refs.set(ref, WidgetWithApiRef(ref));
  }
  return refs.get(ref);
};

function HooksWidgetWithApiRef(
  props: typeof WidgetWithApiRefInput & RestProps,
  ref: any
) {
  return (
    <HookComponent renderFn={WidgetWithApiRefFn(ref)} renderProps={props} />
  );
}
const HooksWidgetWithApiRefFR = forwardRef(HooksWidgetWithApiRef);

export { HooksWidgetWithApiRefFR };

export default HooksWidgetWithApiRefFR;
