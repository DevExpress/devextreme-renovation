function view(viewModel: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  method1: (a: number) => void;
  method2: () => null;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const __privateMethod = useCallback(function __privateMethod(
    a: number
  ): any {},
  []);
  const method1 = useCallback(function method1(a: number): void {
    return __privateMethod(a);
  }, []);
  const method2 = useCallback(function method2(): null {
    return null;
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    method1,
    method2,
    restAttributes: __restAttributes(),
  });
};

Widget.defaultProps = {
  ...WidgetInput,
};

export default Widget;
