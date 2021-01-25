import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  RefObject,
} from "../../../component_declaration/common";

function view({ host }: SetNonElementRef) {
  return <span className="set-non-element-ref" ref={host}></span>;
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class SetNonElementRef extends JSXComponent<Props>() {
  @Ref() host!: RefObject<HTMLDivElement>;
  @Ref() obj!: RefObject<{
    value: number;
  }>;

  @Effect({ run: "once" })
  setObj() {
    this.obj.current = { value: 10 };
  }

  @Effect()
  printObj() {
    if (this.host.current) {
      this.host.current.innerHTML = `non-object-ref-value: ${this.obj.current?.value}`;
    }
  }
}
