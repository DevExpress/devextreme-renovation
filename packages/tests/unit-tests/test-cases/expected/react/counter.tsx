function view(model: Counter) {
  return (
    <button id={model.props.id} onClick={model.onClick}>
      {model.value}
    </button>
  );
}

export declare type CounterInputType = {
  id?: string;
};
export const CounterInput: CounterInputType = {};
import * as React from "react";
import { useState, useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Counter {
  props: typeof CounterInput & RestProps;
  value: number;
  onClick: () => any;
  restAttributes: RestProps;
}

export default function Counter(props: typeof CounterInput & RestProps) {
  const [__state_value, __state_setValue] = useState<number>(1);

  const __onClick = useCallback(
    function __onClick(): any {
      __state_setValue((__state_value) => __state_value + 1);
    },
    [__state_value]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { id, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    value: __state_value,
    onClick: __onClick,
    restAttributes: __restAttributes(),
  });
}

Counter.defaultProps = CounterInput;
