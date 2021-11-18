import { Component, JSXComponent } from "@devextreme-generator/declarations";
import { WidgetInput, SimpleComponent } from "./simple";

function view({ props: { color } }: PickPropsComponent) {
  return <SimpleComponent color={color} />;
}
type PickPropsInput = Pick<WidgetInput, "color">;

@Component({
  view,
  jQuery: {register: true},
})
export class PickPropsComponent extends JSXComponent<PickPropsInput>() {}
