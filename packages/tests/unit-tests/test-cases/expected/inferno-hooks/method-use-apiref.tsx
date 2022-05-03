import { MutableRefObject } from 'react';
import { createElement as h } from 'inferno-create-element';
import BaseWidget from './method';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno'
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

export type WidgetWithApiRefInputType = {
  prop1?: number;
};
const WidgetWithApiRefInput: WidgetWithApiRefInputType = {};
import { WidgetRef as BaseWidgetRef } from './method';
import {
  useCallback,
  useRef,
  useImperativeHandle,
  HookComponent,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type WidgetWithApiRefRef = { getSomething: () => string };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithApiRef {
  props: typeof WidgetWithApiRefInput & RestProps;
  baseRef: any;
  restAttributes: RestProps;
}

const WidgetWithApiRef = (
  props: typeof WidgetWithApiRefInput & RestProps,
  ref: RefObject<WidgetWithApiRefRef>
) => {
  const __baseRef: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop1, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __getSomething = useCallback(
    function __getSomething(): string {
      return `${props.prop1} + ${__baseRef?.current?.getHeight(1, undefined)}`;
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
};

WidgetWithApiRef.defaultProps = WidgetWithApiRefInput;

function HooksWidgetWithApiRef(
  props: typeof WidgetWithApiRefInput & RestProps,
  ref: RefObject<WidgetWithApiRefRef>
) {
  return (
    <HookComponent
      renderFn={WidgetWithApiRef}
      renderProps={props}
      renderRef={ref}
    />
  );
}
const HooksWidgetWithApiRefFR = forwardRef(HooksWidgetWithApiRef);

export { HooksWidgetWithApiRefFR };

export default HooksWidgetWithApiRefFR;
