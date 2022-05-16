import { GetPropsType } from '@devextreme/runtime/react';
const loadingJSX = ({ text }: any) => {
  return <div>{text}</div>;
};
function infoJSX(text: string, name: string) {
  return <span>{`${text} ${name}`}</span>;
}

interface WidgetInputType {
  loading?: boolean;
  greetings?: string;
}
export const WidgetInput = {
  loading: true,
  greetings: 'Hello',
} as Partial<WidgetInputType>;
import { useCallback, HookComponent } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  loadingProps: any;
  name: any;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetInput & RestProps) {
  const __loadingProps = useCallback(function __loadingProps(): any {
    return { text: 'Loading...' };
  }, []);
  const __name = useCallback(function __name(): any {
    return 'User';
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { greetings, loading, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    loadingProps: __loadingProps(),
    name: __name(),
    restAttributes: __restAttributes(),
  });
}

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
function view(viewModel: Widget) {
  const MyComponent = viewModel.props.loading
    ? loadingJSX(viewModel.loadingProps)
    : infoJSX(viewModel.props.greetings, viewModel.name);
  return <div>{MyComponent}</div>;
}
