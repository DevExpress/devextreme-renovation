import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
export const viewFunction = ({ props: { a, ...rest } }: Widget) => {
  return <div {...rest}></div>;
};

interface WidgetPropsType {
  a?: Array<Number>;
  id?: string;
  onClick?: (e: any) => void;
}
export const WidgetProps = {
  a: Object.freeze([1, 2, 3]) as any,
  id: '1',
} as Partial<WidgetPropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetPropsModel = Required<
  Omit<GetPropsType<typeof WidgetProps>, 'onClick'>
> &
  Partial<Pick<GetPropsType<typeof WidgetProps>, 'onClick'>>;
interface Widget {
  props: WidgetPropsModel & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsModel>(WidgetProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { a, id, onClick, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}
