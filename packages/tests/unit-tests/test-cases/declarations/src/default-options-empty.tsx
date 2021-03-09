import {
  JSXComponent,
  Component,
  ComponentBindings,
} from "@devextreme-generator/declaration";

function view() {
  return <div></div>;
}

@ComponentBindings()
export class WidgetProps {}
@Component({
  view: view,
  defaultOptionRules: [
    {
      device: true,
      options: {},
    },
  ],
})
export default class Widget extends JSXComponent(WidgetProps) {}
