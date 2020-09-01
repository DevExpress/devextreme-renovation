import {
  OneWay,
  ComponentBindings,
} from "../../../../component_declaration/common";

export declare type Options = {
  value: string;
};

export declare type AdditionalOptions = {
  index: number;
};

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
