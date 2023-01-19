import { WidgetWithProps } from './dx-widget-with-props';
function view(model: Widget): any {
  return <WidgetWithProps />;
}

export type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import { useCallback } from 'preact/hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

Widget.defaultProps = WidgetInput;
