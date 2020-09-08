import { Options, AdditionalOptions } from "./types.d";

import { Input } from "@angular/core";
export default class WidgetProps {
  @Input() height?: number = 10;
  @Input() data?: Options = { value: "" };
  @Input() info?: AdditionalOptions = { index: 0 };
}
export * from "./types.d";
