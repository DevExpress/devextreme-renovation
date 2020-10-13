import {
  JSXComponent,
  Component,
  ComponentBindings,
  OneWay,
} from "../../../../component_declaration/common";
import { COMPONENT_INPUT_CLASS } from "./component-input";
import { WidgetTwo as ExternalComponent } from "./component-pass-two";

export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;

type Item = {
  text: string;
  key: number;
};

const getKey = (item: Item) => item.key;

function view({ props: { items } }: WidgetWithGlobals) {
  return (
    <div className={CLASS_NAME}>
      <span className={CLASS_NAME}></span>
      <ExternalComponent />
      {items.map((item) => (
        <div key={getKey(item)}></div>
      ))}
    </div>
  );
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() items: Item[] = [];
}

@Component({ view })
export default class WidgetWithGlobals extends JSXComponent(WidgetProps) {}
