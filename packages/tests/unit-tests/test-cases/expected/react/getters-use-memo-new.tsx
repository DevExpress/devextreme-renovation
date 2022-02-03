const buttonClass = "my-buttom";

import * as React from "react";
import { useCallback, useMemo } from "react";
export default function Button({ className }: { className?: string }) {
  const classes = useMemo(() => {
    return className ? `${buttonClass} ${className}` : buttonClass;
  }, [className]);
  return <button className={classes}>My Button</button>;
}
