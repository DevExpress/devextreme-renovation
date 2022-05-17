import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import DomComponentWrapper from './dom_component_wrapper';
function view(model: Widget): any {
  return <DomComponentWrapper></DomComponentWrapper>;
}

interface WidgetInputType {
  prop1?: number;
  prop2?: string;
  templateProp?: any;
  renderProp?: any;
  componentProp?: any;
  isReactComponentWrapper?: boolean;
}
export const WidgetInput = {
  prop1: 10,
  prop2: 'text',
  isReactComponentWrapper: true,
} as Partial<WidgetInputType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  isReactComponentWrapper?: boolean;
};
type WidgetInputModel = Required<
  Omit<
    GetPropsType<typeof WidgetInput>,
    'templateProp' | 'renderProp' | 'componentProp'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetInput>,
      'templateProp' | 'renderProp' | 'componentProp'
    >
  >;
interface Widget {
  props: WidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        componentProp,
        isReactComponentWrapper,
        prop1,
        prop2,
        renderProp,
        templateProp,
        ...restProps
      } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
