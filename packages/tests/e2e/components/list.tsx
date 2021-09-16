import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  InternalState,
} from "@devextreme-generator/declarations";
import ListItem from "./list-item";

function view({ itemsGetter, restAttributes, counter }: List) {
  const firstList = itemsGetter.map((item) =>
    item !== null ? (
      <ListItem
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

      {itemsGetter.map((item, index) => (
        <ListItem
          key={index}
          color={item.color || "green"}
          onClick={item.onClick}
          text={item.text}
          onReady={item.onReady}
        />
      ))}

      {itemsGetter.map(({ text, key, color, onClick, onReady }) => (
        <ListItem
          key={key}
          color={color || "blue"}
          onClick={onClick}
          text={text}
          onReady={onReady}
        />
      ))}

      {itemsGetter.map(({ text, key }) => {
        const value = `${key}: ${text} `;
        return value;
      })}
      <span className="ready-counter">{counter}</span>
    </div>
  );
}

@ComponentBindings()
export class ListProps {
  @OneWay() items: {
    text: string;
    key: number;
    color?: string;
  }[] = [];

  @Event() onClick?: (index: number) => void;
}

@Component({
  view,
})
export default class List extends JSXComponent(ListProps) {
  @InternalState() counter = 0;

  get itemsGetter() {
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
}
