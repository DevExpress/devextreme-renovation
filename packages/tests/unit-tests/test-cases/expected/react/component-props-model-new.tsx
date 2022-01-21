import * as React from "react";
import { useCallback } from "react";
export default function Button(props: { id?: string; text?: string }) {
  return <button id={props.id}>{props.text}</button>;
}
