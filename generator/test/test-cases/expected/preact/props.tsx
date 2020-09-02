function view(model: Widget): any {
  return <span></span>;
}
export declare type WidgetInputType = {
  height: number;
  export: object;
  onClick: (a: number) => void;
};
const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
};
import Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const getHeight = useCallback(
    function getHeight(): number {
      props.onClick(10);
      const { onClick } = props;
      onClick(11);
      return props.height;
    },
    [props.onClick, props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { export: exportProp, height, onClick, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getHeight,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
