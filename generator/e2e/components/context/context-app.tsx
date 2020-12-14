import SimpleProviderComponent from "./provider";
import SimpleContextConsumerComponents from "./consumer";
import {
  ComponentBindings,
  Component,
  JSXComponent,
  InternalState,
  Ref,
  Effect,
  RefObject,
} from "../../../component_declaration/common";
import GridComponent from "./grid";
import Pager from "./pager";
import Paging from "./paging";

import GetterProvider from "./getter-context";

function view(model: ContextApp) {
  return (
    <div>
      <div id="context-simple-context">
        <SimpleProviderComponent />
        <SimpleContextConsumerComponents />

        <GetterProvider p={model.pageIndex} />
      </div>

      <GridComponent>
        <Pager />
        <Paging
          pageIndex={model.pageIndex}
          pageIndexChange={model.setPageIndex}
        />
      </GridComponent>

      <input id="context-app-input" ref={model.input} value={model.pageIndex} />
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

  @Ref() input!: RefObject<HTMLInputElement>;

  @Effect()
  inputEffect() {
    this.input.addEventListener("input", () => {
      this.setPageIndex(Number(this.input.value) || 0);
    });
  }

  setPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
}
