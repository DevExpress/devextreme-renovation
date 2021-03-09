import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
  OneWay,
} from "../../../../component_declaration/common";
import {
  InterfaceTemplateInput,
  ClassTemplateInput,
  TypeTemplateInput,
} from "./types";
interface TemplateInput {
  inputInt: number;
}

@ComponentBindings()
class Props {
  @OneWay() PropFromClass?: ClassTemplateInput;
  @OneWay() PropFromInterface?: TemplateInput;
  @OneWay() PropFromImportedInterface?: InterfaceTemplateInput;
  @OneWay() PropFromImportedType?: TypeTemplateInput;
  @Template() template: JSXTemplate<
    { width: string; height: string },
    "width"
  > = (props) => <div></div>;
  @Template() template2: JSXTemplate<TemplateInput> = () => <div></div>;
}
function view(model: Widget) {
  return (
    <div>
      <model.props.template {...model.spreadGetter}></model.props.template>

      <model.props.template2
        {...model.props.PropFromClass}
      ></model.props.template2>
      <model.props.template2
        {...model.props.PropFromInterface}
      ></model.props.template2>
      <model.props.template2
        {...model.props.PropFromImportedInterface}
      ></model.props.template2>
      <model.props.template2
        {...model.props.PropFromImportedType}
      ></model.props.template2>
    </div>
  );
}
@Component({ view: view })
export default class Widget extends JSXComponent(Props) {
  get spreadGetter(): { width: string; height: string } {
    return {
      width: "40px",
      height: "30px",
    };
  }
}
