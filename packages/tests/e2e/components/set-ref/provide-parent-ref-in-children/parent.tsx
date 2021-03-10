import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  Ref,
  Slot,
  RefObject,
} from "@devextreme-generator/declaration";

function view({ host, props: { children } }: ProvideRefFromParentToChildren) {
  return <div ref={host}>{children}</div>;
}

@ComponentBindings()
class Props {
  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
  @Slot() children!: JSX.Element;
}

@Component({
  view,
})
export default class ProvideRefFromParentToChildren extends JSXComponent<
  Props,
  "children"
>() {
  @Ref() host!: RefObject<HTMLDivElement>;

  @Effect({ run: "once" })
  init() {
    if (this.props.elementRef) {
      this.props.elementRef.current = this.host.current;
    }
  }
}
