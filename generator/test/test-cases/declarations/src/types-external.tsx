import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = {
  number: number;
  text: string;
};
export declare type StringArr = Array<String>;
export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

@ComponentBindings()
export class WidgetProps {
  @OneWay() data: EnumType = "data";
  @OneWay() union: Union = "uniontext";
  @OneWay() obj: ObjType = {
    number: 123,
    text: "sda",
  };
  @OneWay() strArr: StringArr = ["ba", "ab"];
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}
