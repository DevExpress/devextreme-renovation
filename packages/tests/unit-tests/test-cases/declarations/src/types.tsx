import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";
import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
  WidgetProps as ExternalWidgetProps
} from "./types-external";

export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

@ComponentBindings()
export class WidgetProps {
  @OneWay() str: String = "";
  @OneWay() num: Number = 1;
  @OneWay() bool: Boolean = true;
  @OneWay() arr: Array<any> = [];
  @OneWay() strArr: Array<String> = ["a", "b"];
  @OneWay() obj: Object = {};
  @OneWay() date: Date = new Date();
  @OneWay() func: Function = () => {};
  @OneWay() symbol: Symbol = Symbol("x");

  @OneWay() externalEnum: EnumType = "data";
  @OneWay() externalUnion: Union = 0;
  @OneWay() externalObj: ObjType = {
    number: 0,
    text: "text",
  };
  @OneWay() externalArray: StringArr = ["s1", "s2"];
  @OneWay() externalString: StringType = "someValue";
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}


type BaseViewPropsType = Pick<WidgetProps, 'strArr'> & Pick<ExternalWidgetProps, 'customTypeField'>;