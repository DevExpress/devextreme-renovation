import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declarations";

function view({ host }: SetForwardRef) {
  return <span className="set-forward-ref" ref={host}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() forwardHost?: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class SetForwardRef extends JSXComponent<Props>() {
  @Ref() host!: RefObject<HTMLDivElement>;

  @Effect({ run: "once" })
  forwardHost() {
    if (this.props.forwardHost) {
      this.props.forwardHost.current = this.host.current;
    }
  }
}
