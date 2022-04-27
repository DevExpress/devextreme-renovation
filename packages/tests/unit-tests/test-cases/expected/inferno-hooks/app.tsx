function view(model: SimpleComponent) {
  return (
    <div
      id="simple"
      style={normalizeStyles({
        backgroundColor: model.props.color,
        width: model.props.width,
        height: model.props.height,
      })}
    ></div>
  );
}

export type WidgetInputType = {
  height: number;
  width: number;
  color?: string;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  width: 10,
  color: 'red',
};
import {
  useCallback,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface SimpleComponent {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

function ReactSimpleComponent(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { color, height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

HooksSimpleComponent.defaultProps = WidgetInput;

function HooksSimpleComponent(props: typeof WidgetInput & RestProps) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactSimpleComponent}
      renderProps={props}
      defaultProps={HooksSimpleComponent.defaultProps}
    />
  );
}
export { HooksSimpleComponent as SimpleComponent };
export default HooksSimpleComponent;
