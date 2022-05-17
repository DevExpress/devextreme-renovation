

function view(model: Widget) {
  return <span></span>;
}

import {
  useState,
  useCallback,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  _hovered: Boolean;
  updateState: () => any;
  restAttributes: RestProps;
}

export function Widget(props: {} & RestProps) {
  const [__state__hovered, __state_set_hovered] = useState<Boolean>(false);

  const __updateState = useCallback(
    function __updateState(): any {
      __state_set_hovered((__state__hovered) => !__state__hovered);
    },
    [__state__hovered]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    ...props,
    _hovered: __state__hovered,
    updateState: __updateState,
    restAttributes: __restAttributes(),
  });
}

function HooksWidget(props: {} & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
