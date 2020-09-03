import Props from "./component-bindings-only";
import { Options } from "./types.d";
function view(model: Widget) {
  return <div>{model.props.data?.value}</div>;
}
import { AdditionalOptions } from "./component-bindings-only";
export declare type WidgetPropsType = {
  data?: Options;
  info?: AdditionalOptions;
};
const WidgetProps: WidgetPropsType = {
  data: Props.data,
  info: Props.info,
};
import Preact from "preact";
import { useState, useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  innerData: Options;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
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
}

Widget.defaultProps = {
  ...WidgetProps,
};
export * from "./types.d";
