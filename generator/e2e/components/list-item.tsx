import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
  Effect,
  Ref,
} from "../../component_declaration/common";
const CLASS_NAME = "list-item";

function view({ props: { text }, style, host }: ListItem) {
  return (
    <div ref={host as any} style={style} className={CLASS_NAME}>
      {text}
    </div>
  );
}

@ComponentBindings()
export class ListItemProps {
  @OneWay() text!: string;
  @OneWay() color!: string;
  @Event() onClick!: () => void;

  @Event() onReady?: () => void;
}

@Component({
  view,
})
export default class ListItem extends JSXComponent<
  ListItemProps,
  "text" | "color" | "onClick"
>() {
  @Ref() host!: HTMLDivElement;

  @Effect()
  onClickEffect() {
    const handler = () => {
      this.props.onClick();
    };

    this.host.addEventListener("click", handler);

    return () => this.host.removeEventListener("click", handler);
  }

  @Effect({ run: "once" })
  start() {
    this.props.onReady?.();
  }

  get style() {
    return {
      backgroundColor: this.props.color,
      margin: 2,
      fontSize: 18,
      display: "inline-block",
      color: "white",
    };
  }
}
