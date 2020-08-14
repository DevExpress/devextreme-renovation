import { Component, JSXComponent } from "../../component_declaration/common";
import { WidgetInput, SimpleComponent } from "./simple";

function view({ props: { color } }: PickPropsComponent) {
  return <SimpleComponent color={color} />;
}
type PickPropsInput = Pick<WidgetInput, "color">;

@Component({
  view,
})
export class PickPropsComponent extends JSXComponent<PickPropsInput>() {}
