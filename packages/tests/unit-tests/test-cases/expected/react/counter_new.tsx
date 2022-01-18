export declare type CounterInputType = {
  id?: string;
};
export const CounterInput: CounterInputType = {};
import * as React from "react";
import { useState, useCallback } from "react";
export default function Counter(model: typeof CounterInput) {
  const [value, setValue] = useState(1);
  const onClick = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return (
    <button id={model.id} onClick={onClick}>
      {value}
    </button>
  );
}
