import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

import { WidgetWithProps } from './dx-widget-with-props';
import { PublicWidgetWithProps } from './dx-public-widget-with-props';

function view(model: WidgetWithNestedWidgets) {
  return (
    <div>
      <WidgetWithProps value="private widget" />
      <PublicWidgetWithProps value="public widget" />
    </div>
  );
}

@ComponentBindings()
export class WidgetWithNestedWidgetsProps {
}

@Component({
  view: view,
  jQuery: { register: true }
})
export default class WidgetWithNestedWidgets extends JSXComponent(WidgetWithNestedWidgetsProps) {}
