function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  HTMLAttributes,
} from "react";

export type WidgetRef = { getValue: () => any };
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
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

export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
