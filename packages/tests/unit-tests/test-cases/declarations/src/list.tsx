import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from "@devextreme-generator/declarations";
import { WidgetWithProps } from "./dx-widget-with-props";
const noop = (e: any) => {};
@ComponentBindings()
export class ListInput {
  @OneWay() items?: Array<{ key: number; text: string }>;
  @Template() ListItem: JSXTemplate<{
    value: string;
    onClick: (e: any) => void;
  }> = WidgetWithProps;
}

@Component({
  view,
})
export default class List extends JSXComponent(ListInput) {}

function view(model: List) {
  const items = model.props.items?.map((item: any) => {
    return <div key={item.key}>{item.text}</div>;
  });
  const items2 = model.props.items?.map((item: any) => {
    return (
      <div key={item.key}>
        <model.props.ListItem value={item.text} />
        <div className="footer"></div>
      </div>
    );
  });

  return (
    <div>
      {items}
      {items2}
      {model.props.items?.map((item) => (
        <model.props.ListItem key={item.key} value={item.text} onClick={noop} />
      ))}
      {model.props.items?.map(
        (item) =>
          item.text !== "" && (
            <model.props.ListItem
              key={item.key}
              value={item.text}
              onClick={noop}
            />
          )
      )}
    </div>
  );
}
