function view(model: Widget) {
  return (
    <div>
      {model.rendered &&
        document.body &&
        createPortal(<span></span>, document.body)}

      {model.props.someRef?.current! &&
        createPortal(<span></span>, model.props.someRef?.current!)}
    </div>
  );
}
export declare type WidgetPropsType = {
  someRef?: RefObject<HTMLElement>;
};
export const WidgetProps: WidgetPropsType = {};
import React, {
  useState,
  useCallback,
  useEffect,
  RefObject,
  HtmlHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof WidgetProps
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
