import { createPortal } from "react-dom";
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

export declare type WidgetPropsType = {
  someRef?: MutableRefObject<HTMLElement | null>;
};
export const WidgetProps: WidgetPropsType = {};
import * as React from "react";
import {
  useState,
  useCallback,
  useEffect,
  MutableRefObject,
  DOMAttributes,
  HTMLAttributes,
} from "react";

declare type PortalProps = {
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

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps | keyof DOMAttributes<HTMLElement>
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  rendered: boolean;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const [__state_rendered, __state_setRendered] = useState<boolean>(false);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someRef, ...restProps } = props;
      return restProps;
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

Widget.defaultProps = {
  ...WidgetProps,
};
