import SimpleProviderComponent from "./provider";
import {
  ComponentBindings,
  Component,
  JSXComponent,
  InternalState,
  Ref,
  Effect,
} from "../../../component_declaration/common";
import GridComponent from "./grid";
import Pager from "./pager";
import Paging from "./paging";

function view(model: ContextApp) {
  return (
    <div>
      <div id="context-simple-context">
        <SimpleProviderComponent />
      </div>

      <GridComponent>
        <Pager />
        <Paging
          pageIndex={model.pageIndex}
          pageIndexChange={model.setPageIndex}
        />
      </GridComponent>

      <input
        id="context-app-input"
        ref={model.input as any}
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
export default class ContextApp extends JSXComponent(Props) {
  @InternalState() pageIndex = 1;

  @Ref() input!: HTMLInputElement;

  @Effect()
  inputEffect() {
    this.input.addEventListener("input", () => {
      this.pageIndex = Number(this.input.value) || 0;
    });
  }

  setPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
}
