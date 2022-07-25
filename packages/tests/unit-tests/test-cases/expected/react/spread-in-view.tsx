export const viewFunction = ({ props: { a, ...rest } }: Widget) => {
  return <div {...rest}></div>;
};

export type WidgetPropsType = {
  a: Array<Number>;
  id: string;
  onClick?: (e: any) => void;
};
export const WidgetProps: WidgetPropsType = {
  a: Object.freeze([1, 2, 3]) as any,
  id: '1',
};
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { a, id, onClick, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetProps;
