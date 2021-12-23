import { Options, AdditionalOptions } from "./types.d";

import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export default class WidgetProps {
  @Input() height?: number = 10;
  @Input() data?: Options = { value: "" };
  @Input() info?: AdditionalOptions = { index: 0 };
}
