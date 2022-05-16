import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import WidgetWithProps from './props';
function view(model: Widget) {
  return <WidgetWithProps {...model.restAttributes} />;
}

interface WidgetInputType {}
export const WidgetInput = {} as Partial<WidgetInputType>;
import { useCallback } from 'react';

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
export default function Widget(inProps: typeof WidgetInput & RestProps) {
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

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
