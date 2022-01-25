const buttonClass = "my-buttom";

import * as React from "react";
import { useCallback } from "react";
export default function Button({ className }: { className?: string }) {
  const classes = className ? `${buttonClass} ${className}` : buttonClass;
  return <button className={classes}>My Button</button>;
}
