import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import Props from './component-bindings-only';
import { Options } from './types.d';
function view(model: Widget) {
  return <div>{model.props.data?.value}</div>;
}
import { AdditionalOptions } from './types.d';

interface WidgetPropsType {
  data?: Options;
  info?: AdditionalOptions;
}

const WidgetProps = {
  data: Props.data,
  info: Props.info,
} as Partial<WidgetPropsType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetProps>> & RestProps;
  innerData: Options;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetProps>>
  >(WidgetProps, inProps);

  const [__state_innerData, __state_setInnerData] = useState<Options>({
    value: '',
  });

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, info, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    innerData: __state_innerData,
    restAttributes: __restAttributes(),
  });
}
