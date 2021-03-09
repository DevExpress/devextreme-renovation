import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  InternalState,
  Template,
  JSXTemplate,
} from "../../component_declaration/common";
import ListItem, { ListItemProps } from "./list-item";

function view({
  items,
  ListItemTemplate,
  restAttributes,
  counter,
}: ListComponent) {
  const firstList = items.map((item) =>
    item !== null ? (
      <ListItemTemplate
        key={item.key}
        color={item.color || "red"}
        onClick={item.onClick}
        text={item.text}
        onReady={item.onReady}
      />
    ) : (
      <div>empty</div>
    )
  );
  return (
    <div {...restAttributes}>
      {firstList}

      {items.map((item, index) => (
        <ListItemTemplate
          key={index}
          color={item.color || "green"}
          onClick={item.onClick}
          text={item.text}
          onReady={item.onReady}
        />
      ))}

      {items.map(({ text, key, color, onClick, onReady }) => (
        <ListItemTemplate
          key={key}
          color={color || "blue"}
          onClick={onClick}
          text={text}
          onReady={onReady}
        />
      ))}

      {items.map(({ text, key }) => {
        const value = `${key}: ${text} `;
        return value;
      })}
      <span className="ready-counter">{counter}</span>
    </div>
  );
}

@ComponentBindings()
export class ListComponentProps {
  @OneWay() items: {
    text: string;
    key: number;
    color?: string;
  }[] = [];
  @Template() ListItemTemplate: JSXTemplate<
    ListItemProps,
    "text" | "color" | "onClick"
  > = ListItem;
  @Event() onClick?: (index: number) => void;
}

@Component({
  view,
})
export default class ListComponent extends JSXComponent(ListComponentProps) {
  @InternalState() counter = 0;

  get items() {
    return this.props.items.map((item) => {
      return {
        ...item,
        onClick: () => {
          this.props.onClick?.(item.key);
        },
        onReady: () => {
          this.counter++;
        },
      };
    });
  }

  style(color: string) {
    return {
      backgroundColor: color,
      margin: 2,
      fontSize: 18,
      display: "inline-block",
      color: "white",
    };
  }

  get ListItemTemplate() {
    return this.props.ListItemTemplate;
  }
}
