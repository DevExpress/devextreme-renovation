import {
  OneWay,
  ComponentBindings,
} from "@devextreme-generator/declarations";
import { Options, AdditionalOptions } from "./types.d";

@ComponentBindings()
export default class WidgetProps {
  @OneWay() height?: number = 10;
  @OneWay() data?: Options = {
    value: "",
  };
  @OneWay() info?: AdditionalOptions = {
    index: 0,
  };
}
