import {
  OneWay,
  ComponentBindings,
} from "../../../../component_declaration/common";
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
