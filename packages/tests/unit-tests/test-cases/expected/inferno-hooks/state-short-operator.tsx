function view(model: Widget) {
  return <div></div>;
}

export type WidgetInputType = {
  propState: number;
  defaultPropState: number;
  propStateChange?: (propState: number) => void;
};
const WidgetInput: WidgetInputType = {
  defaultPropState: 1,
  propStateChange: () => {},
} as any as WidgetInputType;
import {
  useState,
  useCallback,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  innerState: number;
  updateState: () => any;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetInput & RestProps) {
  const [__state_propState, __state_setPropState] = useState<number>(() =>
    props.propState !== undefined ? props.propState : props.defaultPropState!
  );
  const [__state_innerState, __state_setInnerState] = useState<number>(0);

  const __updateState = useCallback(
    function __updateState(): any {
      __state_setInnerState((__state_innerState) => __state_innerState + 1);
      __state_setInnerState((__state_innerState) => __state_innerState + 1);
      __state_setInnerState((__state_innerState) => __state_innerState + 1);
      __state_setInnerState((__state_innerState) => __state_innerState + 1);
      __state_setPropState(
        (__state_propState) =>
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
      ),
        props.propStateChange!(
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
        );
      __state_setPropState(
        (__state_propState) =>
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
      ),
        props.propStateChange!(
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
        );
      __state_setPropState(
        (__state_propState) =>
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
      ),
        props.propStateChange!(
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
        );
      __state_setPropState(
        (__state_propState) =>
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
      ),
        props.propStateChange!(
          (props.propState !== undefined
            ? props.propState
            : __state_propState) + 1
        );
    },
    [
      __state_innerState,
      props.propState,
      __state_propState,
      props.propStateChange,
    ]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultPropState, propState, propStateChange, ...restProps } = {
        ...props,
        propState:
          props.propState !== undefined ? props.propState : __state_propState,
      };
      return restProps;
    },
    [props, __state_propState]
  );

  return view({
    props: {
      ...props,
      propState:
        props.propState !== undefined ? props.propState : __state_propState,
    },
    innerState: __state_innerState,
    updateState: __updateState,
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = WidgetInput;

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookContainer renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
