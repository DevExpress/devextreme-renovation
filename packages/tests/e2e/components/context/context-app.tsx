import SimpleProviderComponent from "./provider";
import SimpleContextConsumerComponents from "./consumer";
import {
  ComponentBindings,
  Component,
  JSXComponent,
  InternalState,
  Ref,
  RefObject,
} from "@devextreme-generator/declaration";
import GridComponent from "./grid";
import Pager from "./pager";
import Paging from "./paging";

import GetterProvider from "./getter-context";
import PageSelector from "./page-selector";

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
      <div id="context-page-selector">
        <PageSelector
          value={model.pageIndex}
          valueChange={model.pageIndexChange}
        />
      </div>
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

  get pageIndexChange() {
    return (e: number) => this.setPageIndex(e);
  }

  setPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
}
