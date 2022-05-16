import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <div></div>;
}

interface WidgetInputType {}

const WidgetInput = {} as Partial<WidgetInputType>;
import * as React from 'react';
import { useCallback, useImperativeHandle, forwardRef } from 'react';

export type WidgetRef = { getValue: () => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  restAttributes: RestProps;
}
const Widget = forwardRef<WidgetRef, typeof WidgetInput & RestProps>(
  function widget(inProps: typeof WidgetInput & RestProps, ref) {
    const props = combineWithDefaultProps<
      Required<GetPropsType<typeof WidgetInput>>
    >(WidgetInput, inProps);

    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { ...restProps } = props;
        return restProps as RestProps;
      },
      [props]
    );
    const __getValue = useCallback(function __getValue(): any {
      return 0;
    }, []);

    useImperativeHandle(ref, () => ({ getValue: __getValue }), [__getValue]);
    return view({ props: { ...props }, restAttributes: __restAttributes() });
  }
) as React.FC<typeof WidgetInput & RestProps & { ref?: React.Ref<WidgetRef> }>;
export { Widget };

export default Widget;
