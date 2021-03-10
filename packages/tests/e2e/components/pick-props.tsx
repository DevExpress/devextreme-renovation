import { Component, JSXComponent } from "@devextreme-generator/declaration";
import { WidgetInput, SimpleComponent } from "./simple";

function view({ props: { color } }: PickPropsComponent) {
  return <SimpleComponent color={color} />;
}
type PickPropsInput = Pick<WidgetInput, "color">;

@Component({
  view,
})
export class PickPropsComponent extends JSXComponent<PickPropsInput>() {}
