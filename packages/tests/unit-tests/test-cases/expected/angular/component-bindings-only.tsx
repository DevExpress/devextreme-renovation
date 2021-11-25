import { Options, AdditionalOptions } from "./types.d";

import { Injectable, Input } from "@angular/core";
@Injectable()
export default class WidgetProps {
  @Input() height?: number = 10;
  @Input() data?: Options = { value: "" };
  @Input() info?: AdditionalOptions = { index: 0 };
}
