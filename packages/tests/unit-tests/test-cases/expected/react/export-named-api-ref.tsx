function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, useImperativeHandle, forwardRef } from "react";

export type WidgetRef = { getValue: () => any };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetInput & RestProps>(
  function widget(props: typeof WidgetInput & RestProps, ref) {
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { ...restProps } = props;
        return restProps;
      },
      [props]
    );
    const __getValue = useCallback(function __getValue(): any {
      return 0;
    }, []);

    useImperativeHandle(ref, () => ({ getValue: __getValue }), [__getValue]);
    return view({ props: { ...props }, restAttributes: __restAttributes() });
  }
) as React.FC<
  typeof WidgetInput & RestProps & { ref?: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetInput };
export { Widget };

export default Widget;

Widget.defaultProps = WidgetInput;
