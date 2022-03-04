import {
  Component,
  ComponentBindings,
  JSXComponent,
  Fragment,
} from "@devextreme-generator/declarations";
import WidgetWithTemplate from "./dx-widget-with-template";
import InnerWidget from "./dx-inner-widget";

const CustomTemplate = ({ text }: { text: string; value: number }) => {
  return <span>{text}</span>;
};

function view(model: Widget) {
  return (
    <Fragment>
      <WidgetWithTemplate
        template={CustomTemplate}
        componentTemplate={InnerWidget}
        arrowTemplate={(data: { name: string; id: number }) => (
          <div>{data.name}</div>
        )}
      />
      <WidgetWithTemplate
        arrowTemplate={(data: { name: string; id: number }) => (
          <div>{data.id}</div>
        )}
      />
      <WidgetWithTemplate
        typedTemplate={({ array: [param1, param2], obj: { text } }) => (
          <div>{param1} {param2} {text}</div>
        )}
      />
    </Fragment>
  );
}

@ComponentBindings()
export class WidgetProps {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
