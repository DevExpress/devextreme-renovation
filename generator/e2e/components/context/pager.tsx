import {
  Component,
  ComponentBindings,
  JSXComponent,
  Consumer,
  Effect,
  InternalState,
  Ref,
  RefObject,
} from "../../../component_declaration/common";

import { Context } from "./context";
import { PluginContext } from "./context";

function view(model: PagerComponent) {
  return (
    <div>
      Pager:{" "}
      <input
        id="context-pager-input"
        ref={model.input}
        value={model.pageIndex}
      />
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class PagerComponent extends JSXComponent(Props) {
  @Consumer(Context)
  context!: PluginContext;

  @Ref() input!: RefObject<HTMLInputElement>;

  @Effect()
  inputEffect() {
    this.input.current?.addEventListener("input", () => {
      this.setPageIndex(Number(this.input.current?.value) || 0);
    });
  }

  get pageIndex() {
    return this.paging?.pageIndex || 0;
  }

  @InternalState() paging: any;

  setPageIndex(pageIndex: number) {
    this.paging?.setPageIndex(pageIndex);
  }

  @Effect({ run: "once" })
  effect() {
    this.paging = this.context.getPlugin("paging");
    this.context.onChange = () => {
      this.paging = this.context.getPlugin("paging");
    };
  }
}
