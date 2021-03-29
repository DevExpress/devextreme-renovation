import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = {
  number: number;
  text: string;
};
export declare type StringArr = Array<String>;
export declare type StringType = String;
export declare type StrDate = string | Date;

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
  @OneWay() s: StringType = "";
  @OneWay() strDate: StrDate = new Date();
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}
