import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
  Effect,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";
const CLASS_NAME = "list-item";

function view({ props: { text }, style, host }: ListItem) {
  return (
    <div ref={host} style={style} className={CLASS_NAME}>
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
  @Ref() host!: RefObject<HTMLDivElement>;

  @Effect()
  onClickEffect() {
    const handler = () => {
      this.props.onClick();
    };

    this.host.current?.addEventListener("click", handler);

    return () => this.host.current?.removeEventListener("click", handler);
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
