const buttonClass = "my-buttom";
const getClasses = (className?: string) => {
  return className ? `${buttonClass} ${className}` : buttonClass;
};

import * as React from "react";
import { useCallback } from "react";
export default function Button({ className }: { className?: string }) {
  const classes = getClasses(className);
  return <button className={classes}>My Button</button>;
}
