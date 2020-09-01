export declare type Options = { value: string };
export declare type AdditionalOptions = { index: number };

import { Input } from "@angular/core";
export default class WidgetProps {
  @Input() height?: number = 10;
  @Input() data?: Options = { value: "" };
  @Input() info?: AdditionalOptions = { index: 0 };
}
