import {
  Component,
  ComponentBindings,
  JSXComponent,
  Consumer,
  Effect,
  InternalState,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";

import { Context } from "./context";
import { PluginContext } from "./context";
import PageSelector from "./page-selector";

function view(model: PagerComponent) {
  return (
    <div id="pager">
      Pager:{" "}
      <PageSelector
        value={model.pageIndex}
        valueChange={model.pageIndexChange}
      />
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
  jQuery: {register: true},
})
export default class PagerComponent extends JSXComponent(Props) {
  @Consumer(Context)
  contextConsumer!: PluginContext;

  @Ref() input!: RefObject<HTMLInputElement>;

  get pageIndexChange() {
    return (e: number) => this.setPageIndex(e);
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
