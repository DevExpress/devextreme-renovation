import * as React from "react";
import { useState, useCallback } from "react";
export function Widget() {
  const [hovered, setHovered] = useState(false);
  const updateState = useCallback(() => {
    setHovered(!hovered);
  }, [hovered]);
  return <span></span>;
}
