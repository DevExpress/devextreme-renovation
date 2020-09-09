import Base, { WidgetProps } from "./component-input";
function view(model: Child) {
  return <Base height={model.getProps().height} />;
}

export declare type ChildInputType = typeof WidgetProps & {
  height: number;
  onClick: (a: number) => void;
};
const ChildInput: ChildInputType = {
  ...WidgetProps,
  height: 10,
  onClick: () => {},
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof ChildInput
>;
interface Child {
  props: typeof ChildInput & RestProps;
  getProps: () => typeof WidgetProps;
  restAttributes: RestProps;
}

export default function Child(props: typeof ChildInput & RestProps) {
  const getProps = useCallback(
    function getProps(): typeof WidgetProps {
      return { height: props.height } as typeof WidgetProps;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, onClick, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getProps,
    restAttributes: __restAttributes(),
  });
}

Child.defaultProps = {
  ...ChildInput,
};
export * from "./component-input";
