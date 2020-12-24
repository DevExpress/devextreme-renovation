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
  contextConsumer!: PluginContext;

  @Ref() input!: RefObject<HTMLInputElement>;

  @Effect()
  inputEffect() {
    const handler = (e: Event) => {
      this.setPageIndex(
        Number(this.pageIndex.toString() + (e as InputEvent).data) || 0
      );
    };
    this.input.addEventListener("input", handler);

    return () => this.input.removeEventListener("input", handler);
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
    this.paging = this.contextConsumer.getPlugin("paging");
    this.contextConsumer.onChange = () => {
      this.paging = this.contextConsumer.getPlugin("paging");
    };
  }
}
