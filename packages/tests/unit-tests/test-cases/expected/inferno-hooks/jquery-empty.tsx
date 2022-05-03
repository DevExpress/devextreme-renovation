export type PropsType = {
  height?: number;
  width?: number;
};
const Props: PropsType = {};
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
interface Widget {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view1({ props: { ...props }, restAttributes: __restAttributes() });
}

HooksWidget.defaultProps = Props;

function HooksWidget(props: typeof Props & RestProps) {
  return <InfernoWrapperComponent renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.props.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
