import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: ComponentWithRest) {
  return <div {...model.restAttributes}></div>;
}

interface WidgetInputType {
  id?: string;
  export?: {};
}

const WidgetInput = {} as Partial<WidgetInputType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'id' | 'export'>
> &
  Partial<Pick<GetPropsType<typeof WidgetInput>, 'id' | 'export'>>;
interface ComponentWithRest {
  props: WidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function ComponentWithRest(
  inProps: typeof WidgetInput & RestProps
) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { export: exportProp, id, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
