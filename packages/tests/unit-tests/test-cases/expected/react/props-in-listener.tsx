import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <div></div>;
}

interface PropsType {
  type?: string;
  onClick?: (e: any) => void;
}
export const Props = {} as Partial<PropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<
  Omit<GetPropsType<typeof Props>, 'type' | 'onClick'>
> &
  Partial<Pick<GetPropsType<typeof Props>, 'type' | 'onClick'>>;
interface Widget {
  props: PropsModel & RestProps;
  clickHandler: () => any;
  restAttributes: RestProps;
}
export function Widget(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);

  const __clickHandler = useCallback(
    function __clickHandler(): any {
      props.onClick!({ type: props.type });
    },
    [props.onClick, props.type]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { onClick, type, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    clickHandler: __clickHandler,
    restAttributes: __restAttributes(),
  });
}

export default Widget;
