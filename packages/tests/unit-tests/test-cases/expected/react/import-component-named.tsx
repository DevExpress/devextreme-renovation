import { Widget } from "./export-named";
function view(model: Child) {
  return <Widget prop={true} />;
}

export declare type ChildInputType = {
  height: number;
};
const ChildInput: ChildInputType = {
  height: 10,
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof ChildInput
>;
interface Child {
  props: typeof ChildInput & RestProps;
  restAttributes: RestProps;
}

const Child: React.FC<typeof ChildInput & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
};
Child.defaultProps = {
  ...ChildInput,
};

export default Child;
