import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';

interface PropsType {
  height?: number;
  width?: number;
}

const Props = {} as Partial<PropsType>;
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
type PropsModel = Required<
  Omit<GetPropsType<typeof Props>, 'height' | 'width'>
> &
  Partial<Pick<GetPropsType<typeof Props>, 'height' | 'width'>>;
interface Widget {
  props: PropsModel & RestProps;
  restAttributes: RestProps;
}

export function Widget(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, width, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view1({ props: { ...props }, restAttributes: __restAttributes() });
}

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
