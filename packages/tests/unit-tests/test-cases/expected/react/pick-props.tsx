import Props from "./component-bindings-only";
import { Options } from "./types.d";
function view(model: Widget) {
  return <div>{model.props.data?.value}</div>;
}
import { AdditionalOptions } from "./types.d";
export declare type WidgetPropsType = {
  data?: Options;
  info?: AdditionalOptions;
};
const WidgetProps: WidgetPropsType = {
  data: Props.data,
  info: Props.info,
};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  innerData: Options;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetProps & RestProps> = (props) => {
  const [__state_innerData, __state_setInnerData] = useState<Options>({
    value: "",
  });

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, info, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    innerData: __state_innerData,
    restAttributes: __restAttributes(),
  });
};

export default Widget;

Widget.defaultProps = {
  ...WidgetProps,
};
