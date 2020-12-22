import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  OneWay,
  Slot,
} from "../../../../component_declaration/common";

function view(model: Widget){
  const condition = model.props.condition
  return <Fragment>
    { model.props.condition 
    ? <div>{model.props.children}</div>
    : <span>{model.props.children}</span> }
  </Fragment>
}
@ComponentBindings()
export class WidgetProps {
  @OneWay() condition?: boolean;
  @Slot() children?: any;
}
@Component({view: view})
export class Widget extends JSXComponent(WidgetProps){}