import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from "../../../../component_declaration/common";

function view({ props: { text, children } }: WidgetTwo) {
  return (
    <div>
      <span>Two - {text}</span>
      {children}
    </div>
  );
}

@ComponentBindings()
export class WidgetTwoProps {
  @OneWay() text?: string;
  @Slot() children?: any;
}

@Component({
  view: view,
})
export default class WidgetTwo extends JSXComponent(WidgetTwoProps) {}
