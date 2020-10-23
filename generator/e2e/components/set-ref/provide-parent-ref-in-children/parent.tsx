import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  Ref,
  Slot,
} from "../../../../component_declaration/common";

function view({ host, props: { children } }: ProvideRefFromParentToChildren) {
  return <div ref={host as any}>{children}</div>;
}

@ComponentBindings()
class Props {
  @ForwardRef() elementRef?: HTMLDivElement;
  @Slot() children!: JSX.Element;
}

@Component({
  view,
})
export default class ProvideRefFromParentToChildren extends JSXComponent<
  Props
>() {
  @Ref() host!: HTMLDivElement;

  @Effect({ run: "once" })
  init() {
    if (this.props.elementRef) {
      this.props.elementRef = this.host;
    }
  }
}
