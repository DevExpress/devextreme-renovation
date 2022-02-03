import * as React from "react";
import { useCallback } from "react";
export default function Button({ text = "default" }: { text?: string }) {
  return <button>{text}</button>;
}
