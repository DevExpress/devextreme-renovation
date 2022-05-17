import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

interface WidgetInputType {
  someProp?: { current: string };
}
export const WidgetInput = {} as Partial<WidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'someProp'>
> &
  Partial<Pick<GetPropsType<typeof WidgetInput>, 'someProp'>>;
interface Widget {
  props: WidgetInputModel & RestProps;
  someState?: { current: string };
  existsState: { current: string };
  concatStrings: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const [__state_someState, __state_setSomeState] = useState<
    { current: string } | undefined
  >(undefined);
  const [__state_existsState, __state_setExistsState] = useState<{
    current: string;
  }>({ current: 'value' });

  const __concatStrings = useCallback(
    function __concatStrings(): any {
      const fromProps = props.someProp?.current || '';
      const fromState = __state_someState?.current || '';
      return `${fromProps}${fromState}${__state_existsState.current}`;
    },
    [props.someProp, __state_someState, __state_existsState]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProp, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    someState: __state_someState,
    existsState: __state_existsState,
    concatStrings: __concatStrings,
    restAttributes: __restAttributes(),
  });
}
