import * as React from "react";
import { useCallback } from "react";
export default function Button({ id, text }: { id?: string; text?: string }) {
  return <button id={id}>{text}</button>;
}
