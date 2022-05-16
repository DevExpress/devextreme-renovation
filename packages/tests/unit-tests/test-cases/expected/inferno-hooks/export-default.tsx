function view(model: Widget) {
  return <div></div>;
}

interface WidgetInputType {
  prop?: boolean;
}

const WidgetInput = {} as Partial<WidgetInputType>;
import { useCallback, HookComponent } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: WidgetInputModel & RestProps;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
