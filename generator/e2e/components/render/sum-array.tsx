import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Effect,
  Ref,
  RefObject,
} from "../../../component_declaration/common";

function view({ sum, restAttributes, counterRef }: SumArray) {
  return (
    <div {...restAttributes}>
      Sum: <span className={"sum"}>{sum}</span>
      <br />
      Updates:
      <span ref={counterRef} className={"update-count"}>
        0
      </span>
    </div>
  );
}

@ComponentBindings()
export class SumArrayProps {
  @OneWay() array?: number[];
}

@Component({
  view,
})
export default class SumArray extends JSXComponent(SumArrayProps) {
  @Ref() counterRef!: RefObject<HTMLDivElement>;

  @Effect()
  arrayUpdated() {
    if (this.props.array) {
      if (this.counterRef.current) {
        this.counterRef.current.innerText = (
          Number(this.counterRef.current.innerText) + 1
        ).toString();
      }
    }
  }

  get sum(): string {
    return (this.props.array || []).reduce((sum, i) => sum + i, 0).toString();
  }
}
