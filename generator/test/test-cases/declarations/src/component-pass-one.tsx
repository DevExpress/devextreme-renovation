import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from "../../../../component_declaration/common";

function view({ props: { text, children } }: WidgetOne) {
  return (
    <div>
      <span>One - {text}</span>
      {children}
    </div>
  );
}

@ComponentBindings()
export class WidgetOneProps {
  @OneWay() text?: string;
  @Slot() children?: any;
}

@Component({
  view: view,
})
export default class WidgetOne extends JSXComponent(WidgetOneProps) {}
