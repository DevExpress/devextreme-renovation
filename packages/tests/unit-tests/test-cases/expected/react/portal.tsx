import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
function view(model: Widget) {
  return (
    <div>
      {model.rendered ? (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      ) : null}

      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

interface WidgetPropsType {
  someRef?: MutableRefObject<HTMLElement | null>;
}
export const WidgetProps = {} as Partial<WidgetPropsType>;
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

type PortalProps = {
  container?: HTMLElement | null;
  children: React.ReactNode;
};
const Portal = ({
  container,
  children,
}: PortalProps): React.ReactPortal | null => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetPropsModel = Required<
  Omit<GetPropsType<typeof WidgetProps>, 'someRef'>
> &
  Partial<Pick<GetPropsType<typeof WidgetProps>, 'someRef'>>;
interface Widget {
  props: WidgetPropsModel & RestProps;
  rendered: boolean;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsModel>(WidgetProps, inProps);

  const [__state_rendered, __state_setRendered] = useState<boolean>(false);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someRef, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );
  useEffect(() => {
    __state_setRendered((__state_rendered) => true);
  }, []);

  return view({
    props: { ...props },
    rendered: __state_rendered,
    restAttributes: __restAttributes(),
  });
}
