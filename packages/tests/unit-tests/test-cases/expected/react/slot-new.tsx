import * as React from "react";
import { useCallback } from "react";
export function SlotsWidget(viewModel: { id?: string; children: any }) {
  return <div id={viewModel.id}>{viewModel.children}</div>;
}
