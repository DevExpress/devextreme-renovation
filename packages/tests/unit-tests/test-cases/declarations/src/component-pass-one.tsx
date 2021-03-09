import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from "@devextreme-generator/declaration";

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
