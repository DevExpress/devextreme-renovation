import { Options, AdditionalOptions } from "./types.d";

import { Input } from "@angular/core";
export default class WidgetProps {
  __heightInternalValue?: number = 10;
  @Input()
  set height(value: number | undefined) {
    if (value !== undefined) this.__heightInternalValue = value;
    else this.__heightInternalValue = 10;
  }
  get height() {
    return this.__heightInternalValue;
  }

  __dataInternalValue?: Options = { value: "" };
  @Input()
  set data(value: Options | undefined) {
    if (value !== undefined) this.__dataInternalValue = value;
    else this.__dataInternalValue = { value: "" };
  }
  get data() {
    return this.__dataInternalValue;
  }

  __infoInternalValue?: AdditionalOptions = { index: 0 };
  @Input()
  set info(value: AdditionalOptions | undefined) {
    if (value !== undefined) this.__infoInternalValue = value;
    else this.__infoInternalValue = { index: 0 };
  }
  get info() {
    return this.__infoInternalValue;
  }
}
