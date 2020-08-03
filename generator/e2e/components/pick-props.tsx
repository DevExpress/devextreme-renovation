import { Component, JSXComponent } from "../../component_declaration/common";
import { WidgetInput, SimpleComponent } from "./simple.tsx";

function view({ props: { color } }: SimpleComponent) {
  return <SimpleComponent color={color} />;
}
type PickPropsInput = Pick<WidgetInput, "color">;

@Component({
  view,
})
export class PickPropsComponent extends JSXComponent<PickPropsInput>() {}
