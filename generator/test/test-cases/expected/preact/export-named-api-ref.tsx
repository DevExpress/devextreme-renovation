function view(model: Widget) {
  return <div></div>;
}
export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import Preact from "preact";
import { useCallback, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

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
  (props: typeof WidgetInput & RestProps, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => {
          return 0;
        },
      }),
      []
    );
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { ...restProps } = props;
        return restProps;
      },
      [props]
    );

    return view({
      props: { ...props },
      restAttributes: __restAttributes(),
    });
  }
);
export { Widget };

Widget.defaultProps = {
  ...WidgetInput,
};
