import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <div></div>;
}

interface WidgetInputType {}

const WidgetInput = {} as Partial<WidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  simpleGetter: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

  const [__state_decoratedState, __state_setDecoratedState] =
    useState<string>('');
  const [__state_simpleState, __state_setSimpleState] = useState<string>('');

  const __privateGetter = useCallback(
    function __privateGetter(): any {
      return __state_decoratedState.concat(__state_simpleState);
    },
    [__state_decoratedState, __state_simpleState]
  );
  const __simpleGetter = useCallback(
    function __simpleGetter(): any {
      return __state_decoratedState.concat(__state_simpleState);
    },
    [__state_decoratedState, __state_simpleState]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    simpleGetter: __simpleGetter,
    restAttributes: __restAttributes(),
  });
}
