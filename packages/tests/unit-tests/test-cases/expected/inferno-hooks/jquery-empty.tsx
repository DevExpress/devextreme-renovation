export type PropsType = {
  height?: number;
  width?: number;
};
const Props: PropsType = {};
import {
  useCallback,
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

export function Widget(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view1({ props: { ...props }, restAttributes: __restAttributes() });
}

Widget.defaultProps = Props;

function HooksWidget(props: typeof Props & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.props.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
