import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  InternalState,
  RefObject,
} from "@devextreme-generator/declarations";
import ParentWidget from "./parent";
import RefConsumer from "./ref-consumer";

function view({ host, isRendered }: ForwardRefProvider) {
  return (
    <ParentWidget elementRef={host}>
      {isRendered ? (
        <RefConsumer elementRef={host}></RefConsumer>
      ) : (
        <span>consumer is not rendered</span>
      )}
    </ParentWidget>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
  jQuery: {register: true},
})
export default class ForwardRefProvider extends JSXComponent<Props>() {
  @InternalState() isRendered = false;

  @ForwardRef() host!: RefObject<HTMLDivElement>;

  @Effect({ run: "once" })
  init() {
    this.isRendered = true;
  }
}
