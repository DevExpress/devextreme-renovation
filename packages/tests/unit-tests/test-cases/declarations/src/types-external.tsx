import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

export type EnumType = "data" | "none";
export type Union = string | number;
export type ObjType = {
  number: number;
  text: string;
};
export type StringArr = Array<String>;
export type StringType = String;
export type StrDate = string | Date;

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
  @OneWay() customTypeField?: { name: string; customField: CustomType }[];
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}

export interface CustomType {
  name: string;
  value: number;
}
